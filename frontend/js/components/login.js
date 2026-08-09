const Login = {

    data() {
        return {
            email: "",
            password : ""
        };
    },

    methods : {

        async login() {

            try {
                
                const response = await fetch (
                    "http://127.0.0.1:5000/api/auth/login" ,
                    {
                        method : "POST" ,

                        headers : {
                            "Content-Type" : "application/json"
                        },

                        credentials : "include" ,

                        body : JSON.stringify(
                            {
                                email : this.email ,
                                password : this.password
                            }
                        )
                    }
                );

                const data = await response.json();

                console.log(data);
                console.log(typeof data);
                console.log(Object.keys(data));
                console.log(data.message);
                console.log(JSON.stringify(data));

                if (response.ok) {

                    alert(data.message);
                    this.$emit("login-success", data.user);
                }

                else {

                    alert(data.message);
                }
            }
            
            catch(error) {

                console.error(error);

                alert("Unable to connect to server");
            }
        }
    },

    // LOGIN PAGE

    template: `

<div class="d-flex justify-content-center align-items-center"
     style="min-height:100vh; padding-top:70px;">

    <div class="login-card">

        <h3 class="text-center login-title mb-4">
            Trekking Management System
        </h3>

        <form @submit.prevent="login">

            <div class="mb-3">

                <label class="form-label">
                    Email
                </label>

                <input
                    type="email"
                    class="form-control"
                    v-model="email"
                    required
                >

            </div>

            <div class="mb-3">

                <label class="form-label">
                    Password
                </label>

                <input
                    type="password"
                    class="form-control"
                    v-model="password"
                    required
                >

            </div>

            <div class="d-grid">

                <button
                    type="submit"
                    class="btn btn-primary">

                    Login

                </button>

            </div>

        </form>

        <div class="mt-3 text-center">

            <small class="text-muted">

                Don't have an account?

                <a
                    href="#"
                    @click.prevent="$emit('go-register')">

                    Register

                </a>

            </small>

        </div>

    </div>

</div>

`





























}