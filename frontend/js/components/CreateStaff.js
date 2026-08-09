const CreateStaff = {

    data() {

        return {

            name: "",
            email: "",
            password: "",
            contact_details: ""

        };

    },

    methods: {

        async createStaff() {

            try {

                const response = await fetch(
                    "http://127.0.0.1:5000/api/admin/staff",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({

                            name: this.name,
                            email: this.email,
                            password: this.password,
                            contact_details: this.contact_details

                        })

                    }
                );

                const data = await response.json();

                if (response.ok) {

                    alert(data.message);

                    this.name = "";
                    this.email = "";
                    this.password = "";
                    this.contact_details = "";

                    this.$emit("navigate", "staff");

                }

                else {

                    alert(data.message);

                }

            }

            catch (error) {

                console.error(error);

                alert("Unable to connect to server.");

            }

        }

    },

    template: `

<navbar-component
    @logout="$emit('logout')"
    @navigate="$emit('navigate', $event)">
</navbar-component>

<div class="container mt-4" style="padding-top:90px; max-width:700px;">

    <div class="login-card">

        <h3 class="text-center login-title mb-4">

            Create Staff

        </h3>

        <form @submit.prevent="createStaff">

            <div class="mb-3">

                <label class="form-label">

                    Full Name

                </label>

                <input
                    type="text"
                    class="form-control"
                    v-model="name"
                    required>

            </div>

            <div class="mb-3">

                <label class="form-label">

                    Email Address

                </label>

                <input
                    type="email"
                    class="form-control"
                    v-model="email"
                    required>

            </div>

            <div class="mb-3">

                <label class="form-label">

                    Password

                </label>

                <input
                    type="password"
                    class="form-control"
                    v-model="password"
                    required>

            </div>

            <div class="mb-3">

                <label class="form-label">

                    Contact Details

                </label>

                <textarea
                    class="form-control"
                    rows="3"
                    v-model="contact_details"
                    placeholder="Phone number or address"
                    required>
                </textarea>

            </div>

            <div class="d-flex justify-content-between mt-4">

                <button
                    type="button"
                    class="btn btn-secondary"
                    @click="$emit('navigate','staff')">

                    Cancel

                </button>

                <button
                    type="submit"
                    class="btn btn-success">

                    Create Staff

                </button>

            </div>

        </form>

    </div>

</div>

`

};