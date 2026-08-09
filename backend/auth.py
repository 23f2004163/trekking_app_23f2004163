import uuid

from flask import Blueprint , request , jsonify 
from flask_security import login_user , logout_user , current_user
from flask_security.utils import hash_password , verify_password 

from backend.models import User , Role , db 





auth = Blueprint('auth', __name__ , url_prefix='/api/auth') 

## REGISTER 
@auth.route('/register', methods = ['POST']) 
def register() : 
    
    data = request.get_json() 
    
    # check if date already exists 
    if not data : 
        return jsonify({'message': 'No data provided'}),400 
    
    #get values sent by vue js 
    name = data.get('name') 
    email = data.get('email') 
    password = data.get('password') 
    
    #Basic validation 
    if not name or not email or not password : 
        return jsonify({'message' : 'Name , email and password are required'}) ,400 
    
    #normalize email 
    email = email.strip().lower() 
    
    #check whether user already exists 
    existing_user = User.query.filter_by(email=email).first() 
    if existing_user : 
        return jsonify({'message' : 'Email already registered'}) , 409
    
    #find trekker role 
    trekker_role = Role.query.filter_by(name='trekker').first() 
    if not trekker_role : 
        return jsonify({'message' : 'Trekker role not found'}) , 500
    
    #create new user 
    user =  User(
        name = name.strip(), 
        email = email , 
        password = hash_password(password) ,
        active = True,
        status = 'approved',
        fs_uniquifier = str(uuid.uuid4()) )
    
    #Assign trekker role to user 
    user.roles.append(trekker_role) 
    
    db.session.add(user)
    db.session.commit() 
    
    return jsonify({'message' : 'Registration Successful!'}) , 201 

## LOGIN 

@auth.route('/login', methods = ['POST']) 
def login() : 
    
    data = request.get_json() 
    
    if not data : 
        return jsonify({'message' : 'No data provided!'}) , 400 
    
    email = data.get('email') 
    password = data.get('password') 
    
    if not email or not password : 
        return jsonify ({'message' : 'Email and password are required!'}) , 400 
    
    # normalize email 
    email = email.strip().lower()
    
    # find user by email 
    user = User.query.filter_by(email=email).first() 
    
    if not user or not verify_password(password, user.password) : 
        return jsonify({'message' : 'Invalid email or password!'}) , 401 
    
    # prevent blacklisted users from logging in 
    if user.status == 'blacklisted' : 
        return jsonify({'message': 'Your account has been blacklisted!'}) , 403 
    
    #staff must be approved to log in 
    if user.has_role('staff') and user.status != 'approved' : 
        return jsonify({'message' : 'your staff account is waiting for approval!'}) , 403 
    
    #create login session 
    login_user(user) 
    
    return jsonify ({'message' : 'Login succcessful!' , 'user' : {'id' : user.id , 'name' : user.name , 'email' : user.email , 'roles' : [role.name for role in user.roles]}}) , 200
    
    
##LOGOUT 

@auth.route('/logout' , methods = ['POST']) 
def logout() : 
    if current_user.is_authenticated : 
        logout_user() 
        return jsonify({'message' : 'Logout succesful!'}) , 200 
    
    
## CURRENT USER INFO 
@auth.route('/current_user' , methods = ['GET']) 
def get_current_user() : 
    
    if not current_user.is_authenticated : 
        return jsonify({'message' : 'User not logged in!'}) , 401 
    
    return jsonify({'message' : 'Current user info' , 'user' : {'id' : current_user.id , 'name' : current_user.name , 'email' : current_user.email , 'roles' : [role.name for role in current_user.roles]}}) , 200