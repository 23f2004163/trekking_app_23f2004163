const ManageTreks = {

    data() {

        return {

            treks: [],

            activeStaff: []

        };

    },


    methods: {

        async getAllTreks() {

            try {

                const response = await fetch(
                    "http://127.0.0.1:5000/api/admin/treks",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const data = await response.json();

                if (response.ok) {

                    this.treks = data.treks;

                }

                else {

                    alert(data.message);

                }

            }

            catch (error) {

                console.error(error);

                alert("Unable to connect to server.");

            }

        },


        async getActiveStaff() {

            try {

                const response = await fetch(
                    "http://127.0.0.1:5000/api/admin/staff/active",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const data = await response.json();

                if (response.ok) {

                    this.activeStaff = data.staff;

                }

                else {

                    alert(data.message);

                }

            }

            catch (error) {

                console.error(error);

                alert("Unable to connect to server.");

            }

        },


        updateTrek(trek) {

            this.$emit(
                "update-trek",
                trek
            );

        },


        async deleteTrek(trekId) {

            const confirmDelete = confirm(
                "Are you sure you want to delete this trek?"
            );

            if (!confirmDelete) {

                return;

            }


            try {

                const response = await fetch(

                    `http://127.0.0.1:5000/api/admin/treks/${trekId}`,

                    {

                        method: "DELETE",

                        credentials: "include"

                    }

                );


                const data = await response.json();


                if (response.ok) {

                    alert(data.message);

                    await this.getAllTreks();

                }

                else {

                    alert(data.message);

                }

            }

            catch (error) {

                console.error(error);

                alert("Unable to connect to server.");

            }

        },


        assignStaff(trekId) {

            this.$emit(
                "assign-staff",
                trekId
            );

        }

    },


    mounted() {

        this.getAllTreks();

        this.getActiveStaff();

    },


    template: `

    <navbar-component
        :role="'admin'"
        @logout="$emit('logout')"
        @navigate="$emit('navigate', $event)">
    </navbar-component>


    <div
        class="container"
        style="padding-top:100px;">


        <div
            class="d-flex justify-content-between align-items-center mb-4">


            <h2>

                Trek Management

            </h2>


            <button
                class="btn btn-success"
                @click="$emit(
                    'navigate',
                    'create-trek'
                )">

                + Create Trek

            </button>


        </div>


        <div class="row g-4">


            <trek-card

                v-for="trek in treks"

                :key="trek.id"

                :trek="trek"

                :staff-list="activeStaff"

                @update-trek="updateTrek"

                @delete-trek="deleteTrek"

                @assign-staff="assignStaff"

                @staff-assigned="getAllTreks">

            </trek-card>


        </div>


        <div
            v-if="treks.length === 0"
            class="text-center mt-5">

            <h5>

                No Treks Available

            </h5>

        </div>


    </div>

    `

};