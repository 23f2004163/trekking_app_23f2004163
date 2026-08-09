const app = Vue.createApp({

    data() {

        return {

            currentPage: "",

            currentUser: null,

            currentTrek: null

        };

    },


    methods: {


        
        // LOGOUT
        

        async logout() {

            try {

                const response = await fetch(

                    "http://127.0.0.1:5000/api/auth/logout",

                    {

                        method: "POST",

                        credentials: "include"

                    }

                );


                const data = await response.json();


                if (response.ok) {

                    alert(data.message);

                    this.currentUser = null;

                    this.currentPage = "login";

                }

                else {

                    alert(data.message);

                }

            }

            catch(error) {

                console.error(error);

                alert("Unable to logout.");

            }

        },


        
        // CHECK CURRENT USER
       

        async checkCurrentUser() {

            try {

                const response = await fetch(

                    "http://127.0.0.1:5000/api/auth/current_user",

                    {

                        method: "GET",

                        credentials: "include"

                    }

                );


                const data = await response.json();


                if (response.ok) {

                    this.currentUser = data.user;


                    // ADMIN

                    if (
                        data.user.roles.includes("admin")
                    ) {

                        this.currentPage = "dashboard";

                    }


                    // STAFF

                    else if (
                        data.user.roles.includes("staff")
                    ) {

                        this.currentPage =
                            "staff-dashboard";

                    }


                    // TREKKER

                    else {

                        this.currentPage =
                            "user-dashboard";

                    }

                }

                else {

                    this.currentPage = "login";

                }

            }

            catch (error) {

                console.error(error);

                this.currentPage = "login";

            }

        },


       
        // NAVIGATION
        
        navigate(page) {

            this.currentPage = page;

        },


        
        // ADMIN UPDATE TREK
        

        updateTrek(trek) {

            console.log(
                "Selected trek for admin update:",
                trek
            );

            this.currentTrek = trek;

            this.currentPage = "update-trek";

        },


       
        // STAFF UPDATE TREK
       

        updateStaffTrek(trek) {

            console.log(
                "Selected trek for staff update:",
                trek
            );

            this.currentTrek = trek;

            this.currentPage = "staff-update";

        },


      
        // LOGIN SUCCESS
       

        loginSuccess(user) {

            this.currentUser = user;


            // ADMIN

            if (
                user.roles.includes("admin")
            ) {

                this.currentPage =
                    "dashboard";

            }


            // STAFF

            else if (
                user.roles.includes("staff")
            ) {

                this.currentPage =
                    "staff-dashboard";

            }


            // TREKKER

            else {

                this.currentPage =
                    "user-dashboard";

            }

        },


        
        // BOOK TREK
        

        bookTrek(trek) {

            console.log(
                "Selected trek for booking:",
                trek
            );

        }

    },


    
    // MOUNTED
    
    mounted() {

        this.checkCurrentUser();

    },


    template: `


        <!-- ======================================
        LOGIN
        ======================================= -->

        <login-component

            v-if="currentPage === 'login'"

            @login-success="loginSuccess"

            @go-register="
                currentPage='register'
            ">

        </login-component>



        <!-- ======================================
        REGISTER
        ======================================= -->

        <register-component

            v-if="currentPage === 'register'"

            @go-login="
                currentPage='login'
            ">

        </register-component>



        <!-- ======================================
             ADMIN DASHBOARD
        ======================================= -->

        <admin-component

            v-if="currentPage === 'dashboard'"

            @logout="logout"

            @navigate="navigate">

        </admin-component>



        <!-- ======================================
             MANAGE TREKS
        ======================================= -->

        <manage-treks-component

            v-if="
                currentPage === 'manage-treks'
            "

            @logout="logout"

            @navigate="navigate"

            @update-trek="updateTrek">

        </manage-treks-component>



        <!-- ======================================
             CREATE TREK
        ======================================= -->

        <create-trek-component

            v-if="
                currentPage === 'create-trek'
            "

            @navigate="navigate"

            @logout="logout">

        </create-trek-component>



        <!-- ======================================
             ADMIN UPDATE TREK
        ======================================= -->

        <update-trek-component

            v-if="
                currentPage === 'update-trek'
            "

            :trek="currentTrek"

            @navigate="navigate"

            @logout="logout">

        </update-trek-component>



        <!-- ======================================
             CREATE STAFF
        ======================================= -->

        <create-staff-component

            v-if="
                currentPage === 'create-staff'
            "

            @navigate="navigate"

            @logout="logout">

        </create-staff-component>



        <!-- ======================================
             ADMIN MANAGE STAFF
        ======================================= -->

        <manage-staff-component

            v-if="
                currentPage === 'staff'
            "

            @navigate="navigate"

            @logout="logout">

        </manage-staff-component>



        <!-- ======================================
             MANAGE TREKKERS
        ======================================= -->

        <manage-trekkers-component

            v-if="
                currentPage === 'trekkers'
            "

            @navigate="navigate"

            @logout="logout">

        </manage-trekkers-component>



        <!-- ======================================
             USER DASHBOARD
        ======================================= -->

        <user-dashboard-component

            v-if="
                currentPage === 'user-dashboard'
            "

            @navigate="navigate"

            @logout="logout"

            @book-trek="bookTrek">

        </user-dashboard-component>



        <!-- ======================================
             MY BOOKINGS
        ======================================= -->

        <my-bookings-component

            v-if="
                currentPage === 'my-bookings'
            "

            @navigate="navigate"

            @logout="logout">

        </my-bookings-component>



        <!-- ======================================
             ADMIN BOOKINGS
        ======================================= -->

        <manage-bookings-component

            v-if="
                currentPage === 'bookings'
            "

            @navigate="navigate"

            @logout="logout">

        </manage-bookings-component>



        <!-- ======================================
             STAFF DASHBOARD
        ======================================= -->

        <staff-dashboard-component

            v-if="
                currentPage === 'staff-dashboard'
            "

            @navigate="navigate"

            @logout="logout"

            @update-trek="updateStaffTrek">

        </staff-dashboard-component>



        <!-- ======================================
             STAFF UPDATE TREK
        ======================================= -->

        <staff-update-component

            v-if="
                currentPage === 'staff-update'
            "

            :trek="currentTrek"

            @navigate="navigate"

            @logout="logout">

        </staff-update-component>


    `

});




// COMPONENT REGISTRATION


app.component(
    "login-component",
    Login
);


app.component(
    "register-component",
    Register
);


app.component(
    "create-trek-component",
    CreateTrek
);


app.component(
    "admin-component",
    Admin
);


app.component(
    "navbar-component",
    Navbar
);


app.component(
    "trek-card",
    TrekCard
);


app.component(
    "manage-treks-component",
    ManageTreks
);


app.component(
    "update-trek-component",
    UpdateTrek
);


app.component(
    "create-staff-component",
    CreateStaff
);


app.component(
    "manage-staff-component",
    ManageStaff
);


app.component(
    "manage-trekkers-component",
    ManageTrekkers
);


app.component(
    "user-dashboard-component",
    UserDashboard
);


app.component(
    "my-bookings-component",
    MyBookings
);


app.component(
    "manage-bookings-component",
    ManageBookings
);


app.component(
    "staff-dashboard-component",
    StaffDashboard
);


app.component(
    "staff-update-component",
    StaffUpdate
);


app.mount("#app");