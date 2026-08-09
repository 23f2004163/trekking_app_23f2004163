const UserDashboard = {

    emits: ["navigate", "logout"],

    data() {

        return {

            treks: [],

            loading: true,

            bookingTrekId: null

        };

    },


    methods: {

        async getAvailableTreks() {

            try {

                const response = await fetch(

                    "http://127.0.0.1:5000/api/user/treks",

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

            finally {

                this.loading = false;

            }

        },


        async bookTrek(trek) {

            if (this.bookingTrekId) {

                return;

            }

            try {

                this.bookingTrekId = trek.id;

                const response = await fetch(

                    `http://127.0.0.1:5000/api/user/book/${trek.id}`,

                    {

                        method: "POST",

                        credentials: "include",

                        headers: {

                            "Content-Type": "application/json"

                        }

                    }

                );

                const data = await response.json();

                if (response.ok) {

                    alert(data.message);

                    // Refresh available treks
                    // so the slot count is updated

                    await this.getAvailableTreks();

                }

                else {

                    alert(data.message);

                }

            }

            catch (error) {

                console.error(error);

                alert("Unable to connect to server.");

            }

            finally {

                this.bookingTrekId = null;

            }

        }

    },


    mounted() {

        this.getAvailableTreks();

    },


    template: `

    <div>

        <!-- USER NAVBAR -->

        <navbar-component

            :role="'trekker'"

            @logout="$emit('logout')"

            @navigate="$emit('navigate', $event)">

        </navbar-component>


        <!-- AVAILABLE TREKS -->

        <div

            class="container"

            style="padding-top:100px;">

            <div

                class="d-flex justify-content-between align-items-center mb-4">

                <h2>

                    Available Treks

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

                    Loading treks...

                </p>

            </div>


            <!-- NO TREKS -->

            <div

                v-else-if="treks.length === 0"

                class="text-center mt-5">

                <h5>

                    No Treks Available

                </h5>

                <p class="text-muted">

                    There are currently no open treks available for booking.

                </p>

            </div>


            <!-- TREK CARDS -->

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

                                    class="badge bg-success">

                                    {{ trek.status }}

                                </span>

                            </div>


                            <!-- LOCATION -->

                            <p class="mb-2">

                                📍

                                <strong>Location:</strong>

                                {{ trek.location }}

                            </p>


                            <!-- DIFFICULTY -->

                            <p class="mb-2">

                                🏔️

                                <strong>Difficulty:</strong>

                                {{ trek.difficulty }}

                            </p>


                            <!-- DURATION -->

                            <p class="mb-2">

                                ⏳

                                <strong>Duration:</strong>

                                {{ trek.duration_days }} Days

                            </p>


                            <!-- SLOTS -->

                            <p class="mb-2">

                                👥

                                <strong>Available Slots:</strong>

                                {{ trek.available_slots }}

                                /

                                {{ trek.total_slots }}

                            </p>


                            <hr>


                            <!-- START DATE -->

                            <p class="mb-2">

                                📅

                                <strong>Start:</strong>

                                {{ trek.start_date }}

                            </p>


                            <!-- END DATE -->

                            <p class="mb-3">

                                🏁

                                <strong>End:</strong>

                                {{ trek.end_date }}

                            </p>


                            <!-- STAFF -->

                            <p class="mb-3">

                                👤

                                <strong>Staff Assigned:</strong>

                                Yes

                            </p>


                            <!-- BOOK BUTTON -->

                            <div class="mt-auto">

                                <button

                                    class="btn btn-success w-100"

                                    :disabled="

                                        trek.available_slots <= 0 ||

                                        bookingTrekId === trek.id

                                    "

                                    @click="bookTrek(trek)">

                                    <span

                                        v-if="bookingTrekId === trek.id">

                                        Booking...

                                    </span>


                                    <span

                                        v-else-if="trek.available_slots > 0">

                                        🎫 Book Trek

                                    </span>


                                    <span

                                        v-else>

                                        Fully Booked

                                    </span>

                                </button>

                            </div>


                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

    `

};