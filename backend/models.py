from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()


# Association table between users and roles
roles_users = db.Table(
    'roles_users',

    db.Column(
        'user_id',
        db.Integer,
        db.ForeignKey('users.id')
    ),

    db.Column(
        'role_id',
        db.Integer,
        db.ForeignKey('roles.id')
    )
)


class Role(db.Model, RoleMixin):
    """
    Stores application roles:
    - admin
    - staff
    - trekker
    """

    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(80),
        unique=True,
        nullable=False
    )

    description = db.Column(
        db.String(255),
        nullable=True
    )

    def __repr__(self):
        return f"<Role {self.name}>"


class User(db.Model, UserMixin):
    """
    Unified user model.

    All users are stored here:
    - Admin
    - Trek Staff
    - Trekker

    Flask-Security handles authentication and roles.
    """

    __tablename__ = 'users'

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )

    # Required by Flask-Security
    active = db.Column(
        db.Boolean,
        nullable=False,
        default=True
    )

    # Required by Flask-Security
    fs_uniquifier = db.Column(
        db.String(255),
        unique=True,
        nullable=False
    )

    # Staff/Admin management status
    # approved / pending / blacklisted
    status = db.Column(
        db.String(20),
        nullable=False,
        default='approved'
    )

    contact_details = db.Column(
        db.String(15),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    # Flask-Security role relationship
    roles = db.relationship(
        'Role',
        secondary=roles_users,
        backref=db.backref(
            'users',
            lazy='dynamic'
        )
    )

    # User's trek bookings
    bookings = db.relationship(
        'Booking',
        backref='trekker',
        lazy=True
    )

    # Treks assigned to staff
    assigned_treks = db.relationship(
        'Trek',
        backref='assigned_staff',
        lazy=True
    )

    def __repr__(self):
        return f"<User {self.email}>"


class Trek(db.Model):
    """
    Stores all trekking events.

    Used by:
    - Admin trek management
    - Staff assigned trek management
    - Trekker browsing and booking
    """

    __tablename__ = 'treks'

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(150),
        nullable=False
    )

    location = db.Column(
        db.String(150),
        nullable=False
    )

    # Easy / Moderate / Hard
    difficulty = db.Column(
        db.String(20),
        nullable=False
    )

    duration_days = db.Column(
        db.Integer,
        nullable=False
    )

    total_slots = db.Column(
        db.Integer,
        nullable=False
    )

    available_slots = db.Column(
        db.Integer,
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=True
    )

    # Open / Closed / Completed / 
    status = db.Column(
        db.String(20),
        nullable=False,
        default='Open'
    )

    start_date = db.Column(
        db.Date,
        nullable=False
    )

    end_date = db.Column(
        db.Date,
        nullable=False
    )

    # Staff assigned to this trek
    staff_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id'),
        nullable=True
    )

    bookings = db.relationship(
        'Booking',
        
        
        backref='trek',
        lazy=True
    )

    def __repr__(self):
        return f"<Trek {self.title} - {self.status}>"


class Booking(db.Model):
    """
    Connects trekkers with treks.

    Used for:
    - Booking
    - Participant lists
    - Booking history
    - CSV export
    """

    __tablename__ = 'bookings'

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id'),
        nullable=False
    )

    trek_id = db.Column(
        db.Integer,
        db.ForeignKey('treks.id'),
        nullable=False
    )

    booking_date = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    # Booked / Cancelled / completed
    status = db.Column(
        db.String(20),
        nullable=False,
        default='Booked'
    )

    def __repr__(self):
        return (
            f"<Booking ID {self.id} | "
            f"User {self.user_id} -> Trek {self.trek_id}>"
        )