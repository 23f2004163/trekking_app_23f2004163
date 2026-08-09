const StaffDashboard = {

    data() {

        return {

            treks: [],

            loading: true

        };

    },


    methods: {

        async getAssignedTreks() {

            try {

                const response = await fetch(

                    "http://127.0.0.1:5000/api/staff/treks",

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

                alert(
                    "Unable to connect to server."
                );

            }

            finally {

                this.loading = false;

            }

        },


        updateTrek(trek) {

            this.$emit(
                "update-trek",
                trek
            );

        }

    },


    mounted() {

        this.getAssignedTreks();

    },


    template: `

    <navbar-component

        :role="'staff'"

        @logout="$emit('logout')"

        @navigate="$emit(
            'navigate',
            $event
        )">

    </navbar-component>


    <div
        class="container"
        style="padding-top:100px;">


        <!-- HEADER -->

        <div
            class="d-flex justify-content-between align-items-center mb-4">


            <h2>

                Staff Dashboard

            </h2>


        </div>


        <!-- LOADING -->

        <div
            v-if="loading"

            class="text-center mt-5">


            <div
                class="spinner-border"
                role="status">

            </div>


            <p class="mt-2">

                Loading assigned treks...

            </p>


        </div>


        <!-- NO TREKS -->

        <div
            v-else-if="treks.length === 0"

            class="text-center mt-5">


            <h5>

                No Treks Assigned

            </h5>


            <p class="text-muted">

                You currently have no treks assigned to you.

            </p>


        </div>


        <!-- TREKS -->

        <div
            v-else

            class="row g-4">


            <div
                v-for="trek in treks"

                :key="trek.id"

                class="col-12 col-sm-6 col-md-6 col-lg-4">


                <div
                    class="card shadow h-100 border-0">


                    <div
                        class="card-body d-flex flex-column">


                        <!-- TITLE + STATUS -->

                        <div
                            class="d-flex justify-content-between align-items-center mb-3">


                            <h5
                                class="fw-bold mb-0">

                                {{ trek.title }}

                            </h5>


                            <span
                                class="badge"

                                :class="{

                                    'bg-success':
                                        trek.status === 'Open',

                                    'bg-warning text-dark':
                                        trek.status === 'Started',

                                    'bg-primary':
                                        trek.status === 'Completed',

                                    'bg-danger':
                                        trek.status === 'Closed'

                                }">


                                {{ trek.status }}


                            </span>


                        </div>


                        <!-- LOCATION -->

                        <p class="mb-2">

                            📍

                            <strong>
                                Location:
                            </strong>

                            {{ trek.location }}

                        </p>


                        <!-- DIFFICULTY -->

                        <p class="mb-2">

                            🏔️

                            <strong>
                                Difficulty:
                            </strong>

                            {{ trek.difficulty }}

                        </p>


                        <!-- DURATION -->

                        <p class="mb-2">

                            ⏳

                            <strong>
                                Duration:
                            </strong>

                            {{ trek.duration_days }}
                            Days

                        </p>


                        <!-- PARTICIPANTS -->

                        <p class="mb-2">

                            👥

                            <strong>
                                Registered Users:
                            </strong>

                            {{ trek.registered_users }}

                        </p>


                        <!-- SLOTS -->

                        <p class="mb-2">

                            🎟️

                            <strong>
                                Available Slots:
                            </strong>

                            {{ trek.available_slots }}

                            /

                            {{ trek.total_slots }}

                        </p>


                        <hr>


                        <!-- START DATE -->

                        <p class="mb-1">

                            📅

                            <strong>
                                Start:
                            </strong>

                            {{ trek.start_date }}

                        </p>


                        <!-- END DATE -->

                        <p class="mb-3">

                            🏁

                            <strong>
                                End:
                            </strong>

                            {{ trek.end_date }}

                        </p>


                        <!-- ACTION -->

                        <div
                            class="mt-auto">


                            <button

                                v-if="
                                    trek.status === 'Open' ||
                                    trek.status === 'Started'
                                "

                                class="btn btn-primary w-100"

                                @click="
                                    updateTrek(trek)
                                ">


                                ✏️ Update Trek


                            </button>


                            <div
                                v-else

                                class="text-center text-muted">


                                Trek Completed


                            </div>


                        </div>


                    </div>

                </div>

            </div>


        </div>


    </div>

    `

};