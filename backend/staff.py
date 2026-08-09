from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime

from backend.models import db, User, Trek, Booking


staff = Blueprint(
    'staff',
    __name__,
    url_prefix='/api/staff'
)



# GET ASSIGNED TREKS


@staff.route('/treks', methods=['GET'])
@login_required
def get_assigned_treks():

    # Verify staff role

    if not current_user.has_role('staff'):

        return jsonify({
            'message': 'Access denied!'
        }), 403


    # Get only treks assigned to
    # the currently logged-in staff member

    treks = Trek.query.filter_by(
        staff_id=current_user.id
    ).all()


    trek_list = []


    for trek in treks:

        # Count only active bookings

        registered_users = Booking.query.filter_by(
            trek_id=trek.id,
            status='Booked'
        ).count()


        trek_list.append({

            'id': trek.id,

            'title': trek.title,

            'description': trek.description,

            'location': trek.location,

            'difficulty': trek.difficulty,

            'duration_days': trek.duration_days,

            'total_slots': trek.total_slots,

            'available_slots': trek.available_slots,

            'registered_users': registered_users,

            'start_date': trek.start_date.strftime(
                '%d-%m-%Y'
            ),

            'end_date': trek.end_date.strftime(
                '%d-%m-%Y'
            ),

            'status': trek.status,

            'staff_id': trek.staff_id

        })


    return jsonify({

        'treks': trek_list

    }), 200



# UPDATE ASSIGNED TREK


@staff.route(
    '/treks/<int:trek_id>',
    methods=['PUT']
)
@login_required
def update_assigned_trek(trek_id):

    # Verify staff role

    if not current_user.has_role('staff'):

        return jsonify({
            'message': 'Access denied!'
        }), 403


    # Find the trek

    trek = Trek.query.filter_by(
        id=trek_id
    ).first()


    if not trek:

        return jsonify({

            'message': 'Trek not found!'

        }), 404


   
    # Staff can only modify a trek assigned to them
   

    if trek.staff_id != current_user.id:

        return jsonify({

            'message':
                'You are not assigned to this trek.'

        }), 403


    data = request.get_json()


    if not data:

        return jsonify({

            'message': 'Data not provided!'

        }), 400


    
    # ACTIVE BOOKINGS
   
    active_bookings = Booking.query.filter_by(

        trek_id=trek.id,

        status='Booked'

    ).count()


    
    # TOTAL SLOTS
    

    if 'total_slots' in data:

        try:

            new_total_slots = int(
                data['total_slots']
            )

        except (ValueError, TypeError):

            return jsonify({

                'message':
                    'Invalid total slots!'

            }), 400


        if new_total_slots <= 0:

            return jsonify({

                'message':
                    'Total slots must be greater than zero!'

            }), 400


        # Cannot reduce capacity below
        # the number of already registered users

        if new_total_slots < active_bookings:

            return jsonify({

                'message':
                    f'This trek already has '
                    f'{active_bookings} active bookings. '
                    f'Total slots cannot be less than '
                    f'the number of registered users.'

            }), 400


        trek.total_slots = new_total_slots


        # Recalculate available slots

        trek.available_slots = (
            new_total_slots - active_bookings
        )


   
    # STATUS
    

    if 'status' in data:

        new_status = data['status']


        allowed_statuses = [

            'Open',
            'Started',
            'Completed'

        ]


        if new_status not in allowed_statuses:

            return jsonify({

                'message':
                    'Invalid trek status!'

            }), 400


        
        # STATUS TRANSITION VALIDATION
        

        current_status = trek.status


        # Open → Started

        if (
            current_status == 'Open'
            and new_status == 'Started'
        ):

            trek.status = 'Started'


        # Started → Completed

        elif (
            current_status == 'Started'
            and new_status == 'Completed'
        ):

            trek.status = 'Completed'


        # Same status

        elif new_status == current_status:

            trek.status = new_status


        else:

            return jsonify({

                'message':
                    f'Invalid status transition: '
                    f'{current_status} → {new_status}.'

            }), 400


        
        # COMPLETING THE TREK
        

        if (
            new_status == 'Completed'
            and current_status == 'Started'
        ):

            active_booking_records = Booking.query.filter_by(

                trek_id=trek.id,

                status='Booked'

            ).all()


            for booking in active_booking_records:

                booking.status = 'Completed'


   
    # SAVE
    
    db.session.commit()


    return jsonify({

        'message':
            'Trek updated successfully.'

    }), 200