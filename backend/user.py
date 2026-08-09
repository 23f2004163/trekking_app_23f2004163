from flask import Blueprint, jsonify
from flask_login import login_required , current_user

from backend.models import db, Trek , Booking ,User

from backend.cache import redis

import os

import json

user = Blueprint("user", __name__, url_prefix="/api/user")


# GET AVAILABLE TREKS
@user.route("/treks", methods=["GET"])
@login_required
def get_available_treks():

    
    # REDIS CACHE
   
    cache_key = f"available_treks:user:{current_user.id}"

    cached_treks = redis.get(cache_key)

    if cached_treks:

        print("Returning available treks from Redis cache")

        # Convert JSON string back into Python list
        cached_treks = json.loads(cached_treks)

        return jsonify({
            "treks": cached_treks
        }), 200


   
    # DATABASE QUERY
    

    print("Cache miss - fetching treks from database")

    treks = Trek.query.filter(
        Trek.status == "Open",
        Trek.staff_id.isnot(None)
    ).all()

    trek_list = []

    for trek in treks:

        # Check if current user already has
        # an active booking for this trek
        existing_booking = Booking.query.filter_by(
            user_id=current_user.id,
            trek_id=trek.id,
            status="Booked"
        ).first()

        # If already booked, don't show this trek
        if existing_booking:
            continue

        # If no slots are available, don't show this trek
        if trek.available_slots <= 0:
            continue

        trek_list.append({

            "id": trek.id,

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

            "total_slots": trek.total_slots,

            "available_slots": trek.available_slots,

            "status": trek.status,

            "staff_id": trek.staff_id

        })


    
    # STORE IN REDIS
    

    redis.set(
        cache_key,
        json.dumps(trek_list),
        ex=60
    )

    print("Available treks stored in Redis cache")

    return jsonify({
        "treks": trek_list
    }), 200
    
# BOOK A TREK
@user.route('/book/<int:trek_id>', methods=['POST'])
@login_required
def book_trek(trek_id):

    # Find the trek
    trek = Trek.query.filter_by(
        id=trek_id
    ).first()

    if not trek:
        return jsonify({
            'message': 'Trek not found!'
        }), 404


    # Trek must be open
    if trek.status != 'Open':
        return jsonify({
            'message':
                'This trek is not open for booking.'
        }), 400


    # Staff must be assigned
    if not trek.staff_id:
        return jsonify({
            'message':
                'Staff has not been assigned to this trek.'
        }), 400


    # Check available slots
    if trek.available_slots <= 0:
        return jsonify({
            'message':
                'No slots available for this trek.'
        }), 400


    # Check if the user already has a booking
    existing_booking = Booking.query.filter_by(
        user_id=current_user.id,
        trek_id=trek.id,
        status='Booked'
    ).first()

    if existing_booking:
        return jsonify({
            'message':
                'You have already booked this trek.'
        }), 400


    # Create booking
    booking = Booking(
        user_id=current_user.id,
        trek_id=trek.id,
        status='Booked'
    )


    # Reduce available slots
    trek.available_slots -= 1


    # Save booking and trek update
    db.session.add(booking)
    db.session.commit()


   
    # INVALIDATE USER'S AVAILABLE TREKS CACHE
    

    cache_key = (
        f"available_treks:user:{current_user.id}"
    )

    redis.delete(cache_key)


    return jsonify({
        'message':
            'Trek booked successfully!'
    }), 201
    
# GET MY BOOKINGS
@user.route('/bookings', methods=['GET'])
@login_required
def get_my_bookings():

    bookings = Booking.query.filter_by(
        user_id=current_user.id
    ).all()

    booking_list = []

    for booking in bookings:

        trek = Trek.query.filter_by(
            id=booking.trek_id
        ).first()

        if not trek:
            continue

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

            'booking_id': booking.id,

            'booking_date': booking.booking_date.strftime(
                '%d-%m-%Y %H:%M'
            ),

            'status': booking.status,

            'trek_id': trek.id,

            'title': trek.title,

            'description': trek.description,

            'location': trek.location,

            'difficulty': trek.difficulty,

            'duration_days': trek.duration_days,

            'start_date': trek.start_date.strftime(
                '%d-%m-%Y'
            ),

            'end_date': trek.end_date.strftime(
                '%d-%m-%Y'
            ),

            'staff_name': staff_name,

            'staff_contact': staff_contact

        })

    return jsonify({

        'bookings': booking_list

    }), 200
    
# CANCEL BOOKING
@user.route(
    '/bookings/<int:booking_id>/cancel',
    methods=['PUT']
)
@login_required
def cancel_booking(booking_id):

    # Find the booking
    booking = Booking.query.filter_by(
        id=booking_id,
        user_id=current_user.id
    ).first()

    if not booking:
        return jsonify({
            'message': 'Booking not found!'
        }), 404


    # Check booking status
    if booking.status != 'Booked':
        return jsonify({
            'message':
                'Only active bookings can be cancelled!'
        }), 400


    # Find trek
    trek = Trek.query.filter_by(
        id=booking.trek_id
    ).first()

    if not trek:
        return jsonify({
            'message': 'Trek not found!'
        }), 404


    # Cancel booking
    booking.status = 'Cancelled'


    # Restore available slot
    trek.available_slots += 1


    db.session.commit()


  
    # INVALIDATE USER'S AVAILABLE TREKS CACHE
  

    cache_key = (
        f"available_treks:user:{current_user.id}"
    )

    redis.delete(cache_key)


    return jsonify({
        'message':
            'Booking cancelled successfully!'
    }), 200
    
# EXPORT BOOKING HISTORY
@user.route('/export-booking-history', methods=['POST'])
@login_required
def export_booking_history_api():
    
    from backend.tasks import export_booking_history

    # Start Celery task
    task = export_booking_history.delay(
        current_user.id
    )

    return jsonify({
        'message': 'Booking history export started!',
        'task_id': task.id
    }), 202
    
@user.route('/download-booking-history', methods=['GET'])
@login_required
def download_booking_history():

    from flask import send_file
    import tempfile

    file_path = os.path.join(
        tempfile.gettempdir(),
        "trekking_app_exports",
        f'booking_history_{current_user.id}.csv'
    )

    if not os.path.exists(file_path):
        return jsonify({
            'message': 'Export file not found.'
        }), 404

    return send_file(
        file_path,
        as_attachment=True,
        download_name='booking_history.csv',
        mimetype='text/csv'
    )