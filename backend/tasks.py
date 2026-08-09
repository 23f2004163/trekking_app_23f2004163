import csv
import os

from backend.celery_app import celery
from backend.models import db, Booking, Trek, User
import tempfile


@celery.task
def export_booking_history(user_id):

    # Find user
    user = User.query.filter_by(
        id=user_id
    ).first()

    if not user:
        return {
            "success": False,
            "message": "User not found"
        }


    # Get user's bookings
    bookings = Booking.query.filter_by(
        user_id=user_id
    ).all()


    # Create export directory
    export_directory = os.path.join(tempfile.gettempdir(), "trekking_app_exports")

    os.makedirs(
        export_directory,
        exist_ok=True
    )


    # CSV file
    file_path = os.path.join(
        export_directory,
        f"booking_history_{user_id}.csv"
    )


    # Generate CSV
    with open(
        file_path,
        "w",
        newline="",
        encoding="utf-8"
    ) as csv_file:

        writer = csv.writer(csv_file)


        # Header
        writer.writerow([
            "User ID",
            "User Name",
            "Trek Name",
            "Location",
            "Booking Date",
            "Booking Status"
        ])


        # Booking records
        for booking in bookings:

            trek = Trek.query.filter_by(
                id=booking.trek_id
            ).first()

            if not trek:
                continue

            writer.writerow([
                user.id,
                user.name,
                trek.title,
                trek.location,
                booking.booking_date.strftime(
                    "%d-%m-%Y %H:%M"
                ),
                booking.status
            ])


    return {
        "success": True,
        "file_path": file_path,
        "message": "Booking history exported successfully"
    }