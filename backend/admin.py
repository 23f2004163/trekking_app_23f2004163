from flask import Blueprint , request , jsonify 
from flask_security import current_user , login_required ,roles_required 
from flask_security.utils import hash_password 
from datetime import datetime , date
import uuid

from backend.models import User , db , Role , Trek , Booking 


admin = Blueprint(
    'admin',
    __name__,
    url_prefix = '/api/admin' 
)

@admin.route('/dashboard', methods = ['GET']) 
@login_required 
@roles_required('admin')
def dashboard() : 
    
    total_treks = Trek.query.count() 
    total_users = User.query.filter(User.roles.any(Role.name == 'trekker')).count() 
    total_staff = User.query.filter(User.roles.any(Role.name == 'staff')).count() 
    total_bookings = Booking.query.count() 
    
    return jsonify({
        'total_treks' : total_treks ,
        'total_users' : total_users ,
        'total_staff' : total_staff , 
        'total_bookings' : total_bookings 
    }) , 200 
    
    
# CREATE TREK 
@admin.route('/treks' , methods = ['POST']) 
@login_required 
@roles_required('admin')
 

def create_trek() : 
    
    data = request.get_json() 
    
    if not data : 
        return jsonify(
            {'message' : 'No data provided'}
        ) , 400 
        
    # get required fields
    title = data.get('title') 
    location = data.get('location') 
    difficulty = data.get('difficulty')
    duration_days = data.get('duration_days') 
    total_slots = data.get('total_slots') 
    start_date = data.get('start_date') 
    end_date = data.get('end_date') 
    
    #optional field 
    description = data.get('description') 
    
    # validate required fields 
    if not all(
        [title,
         location,
         duration_days,
         total_slots,
         start_date,
         difficulty,
         end_date]
    ) : 
        return jsonify(
            {'message' : 'All required fields must be provided'}
        ) , 400 
        
    # convert date from string to python date object 
    try : 
        start_date = datetime.strptime(
            start_date,
            '%Y-%m-%d',
        ).date() 
        
        end_date = datetime.strptime(
            end_date,
            '%Y-%m-%d' 
        ).date() 
    
    except ValueError : 
        return jsonify(
            {'messsage' : 'Invalid Date!'}
        ) , 400 
        
    #Basic date validation 
    trek = Trek (
        title = title.strip(),
        location = location.strip(),
        difficulty = difficulty ,
        duration_days = duration_days,
        total_slots = total_slots, 
        available_slots = total_slots,
        description = description.strip(),
        status = 'Open' , 
        start_date = start_date,
        end_date = end_date 
    )
        
    db.session.add(trek) 
    db.session.commit()
    
    return jsonify(
        {'message' : 'Trek created successfully!' ,
         'trek_id' : trek.id}
    ), 201 
    

# UPDATE TREK
@admin.route('/treks/<int:trek_id>', methods=['PUT'])
@login_required
@roles_required('admin')
def update_trek(trek_id):

    # Find trek
    trek = Trek.query.filter_by(
        id=trek_id
    ).first()

    if not trek:

        return jsonify({
            'message': 'Trek not found!'
        }), 404


    data = request.get_json()

    print(data)


    if not data:

        return jsonify({
            'message': 'Data not provided!'
        }), 400


   
    # CHECK ACTIVE BOOKINGS
    

    active_bookings = Booking.query.filter_by(
        trek_id=trek.id,
        status='Booked'
    ).count()


    
    # STATUS VALIDATION
    

    if 'status' in data:

        new_status = data['status']


        # Valid statuses
        allowed_statuses = [
            'Open',
            'Started',
            'Completed',
            'Closed'
        ]


        if new_status not in allowed_statuses:

            return jsonify({
                'message': 'Invalid trek status!'
            }), 400


        # Admin should not change operational status
        if new_status in ['Started', 'Completed']:

            return jsonify({
                'message':
                    'Started and Completed status '
                    'must be managed by staff.'
            }), 400


        # Cannot close a trek with active bookings
        if (
            new_status == 'Closed'
            and active_bookings > 0
        ):

            return jsonify({

                'message':
                    'This trek has active bookings '
                    'and cannot be closed.'

            }), 400


        trek.status = new_status


    
    # TOTAL SLOT VALIDATION
    
    if 'total_slots' in data:

        try:

            new_total_slots = int(
                data['total_slots']
            )

        except (ValueError, TypeError):

            return jsonify({
                'message': 'Invalid total slots!'
            }), 400


        if new_total_slots <= 0:

            return jsonify({
                'message':
                    'Total slots must be greater than zero!'
            }), 400


        # Cannot reduce capacity below
        # the number of active bookings
        if new_total_slots < active_bookings:

            return jsonify({

                'message':
                    f'This trek already has '
                    f'{active_bookings} active bookings. '
                    f'Total slots cannot be less than '
                    f'the number of active bookings.'

            }), 400


        # Calculate how many slots are currently occupied
        booked_slots = active_bookings


        trek.total_slots = new_total_slots

        trek.available_slots = (
            new_total_slots - booked_slots
        )


   
    # NORMAL TREK FIELDS
    
    if 'title' in data:

        trek.title = data['title'].strip()


    if 'location' in data:

        trek.location = data['location'].strip()


    if 'difficulty' in data:

        trek.difficulty = data['difficulty']


    if 'duration_days' in data:

        trek.duration_days = data['duration_days']


    if 'description' in data:

        trek.description = data['description']


    
    # START DATE
    

    if 'start_date' in data:

        try:

            trek.start_date = datetime.strptime(
                data['start_date'],
                '%Y-%m-%d'
            ).date()

        except ValueError:

            return jsonify({
                'message': 'Invalid start date!'
            }), 400


    
    # END DATE
    

    if 'end_date' in data:

        try:

            trek.end_date = datetime.strptime(
                data['end_date'],
                '%Y-%m-%d'
            ).date()

        except ValueError:

            return jsonify({
                'message': 'Invalid end date!'
            }), 400


   
    # DATE VALIDATION
   

    if trek.end_date < trek.start_date:

        return jsonify({
            'message':
                'End date cannot be before start date!'
        }), 400


   
    # SAVE
   

    db.session.commit()


    return jsonify({

        'message':
            'Trek has been updated successfully.'

    }), 200
    

@admin.route('/treks/<int:trek_id>' , methods = ["DELETE"]) 
@login_required
@roles_required('admin')
def delete_trek(trek_id) : 
    
    #find the trek 
    trek = Trek.query.filter_by(id=trek_id).first() 
    
    if not trek : 
        return jsonify(
            {'message' : 'Trek not found!'}
        ) , 404 
        
    
    # check whether this trek has booking 
    existing_booking = Booking.query.filter_by(trek_id = trek_id).first()
    
    if existing_booking : 
        return jsonify(
            {'message' : 'This trek has booking history , so cannot be deleted!'}
        ),409 
        
    db.session.delete(trek)
    db.session.commit() 
    
    return jsonify(
        {'message' : 'Trek has been deleted successfully!'}
    ) , 200 
    
## CREATE TREK STAFF

@admin.route('/staff' , methods=['POST']) 
@login_required 
@roles_required('admin')

def create_staff() : 
    
    data = request.get_json() 
    
    if not data : 
        return jsonify(
            {'message' : 'No data provided!'} 
        ) , 400 
        
    #get required fields 
    name = data.get('name') 
    email = data.get('email') 
    password = data.get('password') 
    contact_details = data.get('contact_details') 
    
    #check required fields 
    if not all(
        [name , email , password , contact_details]
    ) : 
        return jsonify (
            {'message' : 'Name , Email , Password and Contact details are required !'} 
        ) , 400 
        
    #normalize email 
    email = email.strip().lower() 
    
    #check whether email already exists 
    email_exists = User.query.filter_by(email = email).first() 
    
    if email_exists : 
        return jsonify(
            {'message' : 'Email already registered!'}
        ) 
        
    #find staff role 
    staff_role = Role.query.filter_by(name='staff').first()
    
    if not staff_role : 
        return jsonify(
            {'message' : 'staff role not found!'}
        ) , 400 
        
    #create staff user 
    staff = User(
        name = name.strip() ,
        email = email.strip() ,
        password = hash_password(password) , 
        contact_details = contact_details ,
        active = True , 
        status = 'approved' ,
        fs_uniquifier = str(uuid.uuid4()) 
        )
    
    #assign staff role 
    staff.roles.append(staff_role) 
    
    db.session.add(staff)
    db.session.commit() 
    
    return jsonify({
        'message' : 'staff user created succesfully' ,
        'staff_id' : staff.id
    }) , 201 
    
# ASSIGN STAFF FOR TREK
@admin.route('/treks/<int:trek_id>/assign-staff', methods=['PUT'])
@login_required
@roles_required('admin')
def assign_staff(trek_id):

    data = request.get_json()

    if not data:
        return jsonify({
            'message': 'Data not provided!'
        }), 400

    staff_id = data.get('staff_id')

    if not staff_id:
        return jsonify({
            'message': 'Staff id is required!'
        }), 400

    # Find trek
    trek = Trek.query.filter_by(
        id=trek_id
    ).first()

    if not trek:
        return jsonify({
            'message': 'Trek not found!'
        }), 404

    # Staff cannot be replaced after trek has started
    if trek.status in ['Started', 'Completed', 'Closed']:

        return jsonify({
            'message':
                'Staff cannot be assigned or replaced '
                'after the trek has started or ended.'
        }), 400

    # Find staff
    staff = User.query.filter_by(
        id=staff_id
    ).first()

    if not staff:
        return jsonify({
            'message': 'Staff not found!'
        }), 404

    # Verify staff role
    if not staff.has_role('staff'):
        return jsonify({
            'message':
                'Selected user is not a trek staff.'
        }), 400

    # Assign / replace staff
    trek.staff_id = staff.id

    db.session.commit()

    return jsonify({
        'message':
            'Staff was assigned to trek successfully.'
    }), 200
    
# GET ALL STAFF
@admin.route('/staff', methods=['GET'])
@roles_required('admin')
def get_all_staff():

    # Get all users who have the staff role
    staff_members = User.query.filter(
        User.roles.any(Role.name == 'staff')
    ).all()

    staff_list = []

    for staff in staff_members:
        staff_list.append({
            'id': staff.id,
            'name': staff.name,
            'email': staff.email,
            'contact_details': staff.contact_details,
            'status': staff.status,
            'active': staff.active
        })

    return jsonify({
        'staff': staff_list
    }), 200
    
# GET ALL TREKS
@admin.route('/treks', methods=['GET'])
@roles_required('admin')
def get_all_treks():

    treks = Trek.query.all()

    trek_list = []

    for trek in treks:

        staff = User.query.get(trek.staff_id)

        trek_list.append({
            'id': trek.id,
            'title': trek.title,
            'location': trek.location,
            'difficulty': trek.difficulty,
            'duration_days': trek.duration_days,
            'description': trek.description,
            'start_date': trek.start_date.strftime('%d-%m-%Y'),
            'end_date': trek.end_date.strftime('%d-%m-%Y'),
            'total_slots': trek.total_slots,
            'available_slots': trek.available_slots,
            'status': trek.status,
            'staff_id': trek.staff_id,
            'staff_name': staff.name if staff else None
        })

    return jsonify({
        "treks": trek_list
    }), 200
    
## GET ALL TREKKERS

@admin.route('/users' , methods=['GET']) 
@login_required 
@roles_required('admin')

def get_all_users() : 
    
    trekkers = User.query.filter(
        User.roles.any(Role.name == 'trekker')
    ).all() 
    
    user_list = [] 
    
    for user in trekkers : 
        user_list.append(
            {'id' : user.id,
             'name' : user.name,
             'email' : user.email,
             'status' : user.status,
             'active' : user.active}
        ) 
    
    return jsonify({
        'users' : user_list 
    }) , 200 


# UPDATE TREKKER STATUS
@admin.route('/users/<int:user_id>/status', methods=['PUT'])
@login_required
@roles_required('admin')
def update_user_status(user_id):

    data = request.get_json()

    if not data:
        return jsonify({
            'message': 'No data provided!'
        }), 400

    new_status = data.get('status')

    # Validate status
    if new_status not in ['approved', 'deactivated', 'blacklisted']:
        return jsonify({
            'message': 'Invalid status!'
        }), 400

    # Find the user
    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({
            'message': 'User not found!'
        }), 404

    # Make sure selected user is actually a trekker
    if not user.has_role('trekker'):
        return jsonify({
            'message': 'Selected user is not a trekker!'
        }), 400

    # Update status
    user.status = new_status

    # Update active based on status
    if new_status == 'approved':
        user.active = True
    else:
        user.active = False

    db.session.commit()

    return jsonify({
        'message': 'User status updated successfully!'
    }), 200
    
# UPDATE STAFF STATUS
@admin.route('/staff/<int:staff_id>/status', methods=['PUT'])
@roles_required('admin')
def update_staff_status(staff_id):

    staff = User.query.filter_by(id=staff_id).first()

    if not staff:
        return jsonify({
            'message': 'Staff not found!'
        }), 404

    if not staff.has_role('staff'):
        return jsonify({
            'message': 'Selected user is not a staff member!'
        }), 400

    data = request.get_json()

    if not data:
        return jsonify({
            'message': 'No data provided!'
        }), 400

    status = data.get('status')

    allowed_status = [
        'approved',
        'deactivated',
        'blacklisted'
    ]

    if status not in allowed_status:
        return jsonify({
            'message': 'Invalid staff status!'
        }), 400

    staff.status = status

    # Update active flag
    staff.active = (status == 'approved')

    db.session.commit()

    return jsonify({
        'message': 'Staff status updated successfully!',
        'staff': {
            'id': staff.id,
            'name': staff.name,
            'status': staff.status,
            'active': staff.active
        }
    }), 200
    
# DELETE STAFF
@admin.route('/staff/<int:staff_id>', methods=['DELETE'])
@roles_required('admin')
def delete_staff(staff_id):

    staff = User.query.filter_by(id=staff_id).first()

    if not staff:
        return jsonify({
            'message': 'Staff not found!'
        }), 404

    if not staff.has_role('staff'):
        return jsonify({
            'message': 'Selected user is not a staff member!'
        }), 400

    db.session.delete(staff)

    db.session.commit()

    return jsonify({
        'message': 'Staff deleted successfully!'
    }), 200
    
# GET ACTIVE STAFF
@admin.route('/staff/active', methods=['GET'])
@roles_required('admin')
def get_active_staff():

    staff_members = User.query.filter(
        User.roles.any(Role.name == 'staff'),
        User.status == 'approved',
        User.active == True
    ).all()

    staff_list = []

    for staff in staff_members:

        staff_list.append({

            'id': staff.id,
            'name': staff.name,
            'email': staff.email

        })

    return jsonify({

        'staff': staff_list

    }), 200
    
    
# GET ALL BOOKINGS - ADMIN
@admin.route('/bookings', methods=['GET'])
@login_required
@roles_required('admin')
def get_all_bookings():

    bookings = Booking.query.all()

    booking_list = []

    for booking in bookings:

        # Get trek
        trek = Trek.query.filter_by(
            id=booking.trek_id
        ).first()

        if not trek:
            continue

        # Get trekker
        user = User.query.filter_by(
            id=booking.user_id
        ).first()

        # Get staff
        staff_name = None
        staff_contact = None

        if trek.staff_id:

            staff = User.query.filter_by(
                id=trek.staff_id
            ).first()

            if staff:

                staff_name = staff.name
                staff_contact = staff.contact_details

        booking_list.append({

            "booking_id": booking.id,

            "user_id": booking.user_id,

            "user_name": user.name if user else None,

            "user_contact": (
                user.contact_details
                if user else None
            ),

            "trek_id": trek.id,

            "title": trek.title,

            "description": trek.description,

            "location": trek.location,

            "difficulty": trek.difficulty,

            "duration_days": trek.duration_days,

            "start_date": trek.start_date.strftime(
                "%d-%m-%Y"
            ),

            "end_date": trek.end_date.strftime(
                "%d-%m-%Y"
            ),

            "booking_date": booking.booking_date.strftime(
                "%d-%m-%Y %H:%M"
            ),

            "status": booking.status,

            "staff_name": staff_name,

            "staff_contact": staff_contact

        })

    return jsonify({

        "bookings": booking_list

    }), 200
    
# GET CURRENT BOOKINGS
@admin.route('/current-bookings', methods=['GET'])
@login_required
@roles_required('admin')
def get_current_bookings():

    bookings = Booking.query.filter_by(
        status='Booked'
    ).all()

    booking_list = []

    for booking in bookings:

        user = User.query.filter_by(
            id=booking.user_id
        ).first()

        trek = Trek.query.filter_by(
            id=booking.trek_id
        ).first()

        if not trek:
            continue

        staff_name = None

        if trek.staff_id:

            staff = User.query.filter_by(
                id=trek.staff_id
            ).first()

            if staff:
                staff_name = staff.name

        booking_list.append({

            'booking_id': booking.id,

            'user_name': (
                user.name
                if user
                else 'Unknown'
            ),

            'trek_title': trek.title,

            'booking_date': booking.booking_date.strftime(
                '%d-%m-%Y %H:%M'
            ),

            'staff_name': (
                staff_name
                if staff_name
                else 'Not Assigned'
            ),

            'status': booking.status

        })

    return jsonify({
        'bookings': booking_list
    }), 200