# import essential libraries
from flask import Flask 
from flask_security import Security, SQLAlchemyUserDatastore
from flask_security.utils import hash_password
from flask_cors import CORS 

from backend.models import db, User, Role
from backend.configurations import SECRET_KEY



def create_app():

    # Create Flask app instance
    app = Flask(__name__)
    
    #configure CORS 
    CORS(app, origins=["http://127.0.0.1:5500"] , supports_credentials=True) 

    # Configure app
    app.config['SECRET_KEY'] = SECRET_KEY

    # Configure database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///trekking_app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Configure Flask-Security
    app.config['SECURITY_PASSWORD_SALT'] = 'veritas-trekking-salt'
    app.config['SECURITY_REGISTERABLE'] = False
    app.config['SECURITY_SEND_REGISTER_EMAIL'] = False

    # Initialize database
    db.init_app(app)

    # Create user datastore and initialize Flask-Security
    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    security = Security(app, user_datastore)

    # Register blueprints
    from backend.auth import auth
    
    from backend.admin import admin 
    
    from backend.user import user 
    
    from backend.staff import staff

    app.register_blueprint(auth)
    
    app.register_blueprint(admin)
    
    app.register_blueprint(user)
    
    app.register_blueprint(staff)

    # Create database tables and initial data
    with app.app_context():

        db.create_all()
        print("database actually used" , db.engine.url)

        
        # CREATE ROLES
        
        for role_name in ['admin', 'staff', 'trekker']:

            role = user_datastore.find_role(role_name)

            if not role:
                user_datastore.create_role(name=role_name)

        # Save roles to database
        db.session.commit()

        
        # CREATE PRE-EXISTING ADMIN
       
        admin = user_datastore.find_user(
            email='admin123@gmail.com'
        )

        if not admin:

            admin = user_datastore.create_user(
                name='AdminSuperuser',
                email='admin123@gmail.com',
                password=hash_password('admin123'),
                status='approved',
                active=True
            )

            admin_role = user_datastore.find_role('admin')

            user_datastore.add_role_to_user(
                admin,
                admin_role
            )

            db.session.commit()

            print(
                "Fresh database detected: "
                "Pre-existing Admin superuser created successfully."
            )

    return app