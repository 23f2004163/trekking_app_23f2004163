const Register = {

    data() {

        return {
            name: "",
            email: "",
            password: ""
    
        };
    },

    methods : {

        async register() {

            try {

                const response = await fetch (
                    "http://127.0.0.1:5000/api/auth/register" ,
                    {
                        method : "POST" ,
                        headers : {
                            "Content-Type": "application/json"
                        },
                        credentials : "include",
                        body : JSON.stringify(
                            {
                                name : this.name,
                                email: this.email,
                                password : this.password
                            }
                        )
                    }

                );

                const data = await response.json();

                if (response.ok) {

                    alert(data.message);
                    this.$emit("register-success");
                }
                else {
                    alert(data.message);
                }
            }

            catch (error) {

                console.error(error);
                alert("Unable to connect to server");
            }
        }


    },

    template: `

<div class="d-flex justify-content-center align-items-center"
     style="min-height:100vh; padding-top:70px;">

    <div class="login-card">

        <h3 class="text-center login-title mb-4">
            Trekking Management System
        </h3>

        <form @submit.prevent="register">

            <div class="mb-3">
                <label class="form-label">
                    Name
                </label>

                <input
                    type="text"
                    class="form-control"
                    v-model="name"
                    required
                >
            </div>

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
                    class="btn btn-success">
                    Register
                </button>
            </div>

        </form>

        <div class="mt-3 text-center">
            <small class="text-muted">
                Already have an account?

                <a
                    href="#"
                    @click.prevent="$emit('go-login')">

                    Login

                </a>

            </small>
        </div>

    </div>

</div>

`
};