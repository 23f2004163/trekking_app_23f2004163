const ManageBookings = {

    data() {

        return {

            bookings: [],

            loading: true

        };

    },

    methods: {

        async getAllBookings() {

            try {

                const response = await fetch(

                    "http://127.0.0.1:5000/api/admin/bookings",

                    {

                        method: "GET",

                        credentials: "include"

                    }

                );

                const data = await response.json();

                if (response.ok) {

                    this.bookings = data.bookings;

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

        }

    },

    mounted() {

        this.getAllBookings();

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

                Booking History

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

                Loading bookings...

            </p>

        </div>


        <!-- NO BOOKINGS -->

        <div
            v-else-if="bookings.length === 0"
            class="text-center mt-5">

            <h5>

                No Bookings Found

            </h5>

            <p class="text-muted">

                No bookings have been made yet.

            </p>

        </div>


        <!-- BOOKING TABLE -->

        <div
            v-else
            class="card shadow border-0">

            <div class="card-body">

                <div class="table-responsive">

                    <table
                        class="table table-hover align-middle mb-0">

                        <thead class="table-dark">

                            <tr>

                                <th>
                                    Booking ID
                                </th>

                                <th>
                                    Trekker
                                </th>

                                <th>
                                    Trek
                                </th>

                                <th>
                                    Booking Date
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            <tr
                                v-for="booking in bookings"
                                :key="booking.booking_id">

                                <td>

                                    #{{ booking.booking_id }}

                                </td>


                                <td>

                                    {{ booking.user_name }}

                                </td>


                                <td>

                                    {{ booking.title }}

                                </td>


                                <td>

                                    {{ booking.booking_date }}

                                </td>


                                <td>

                                    <span
                                        class="badge"
                                        :class="{
                                            'bg-success':
                                                booking.status === 'Booked',

                                            'bg-danger':
                                                booking.status === 'Cancelled',

                                            'bg-primary':
                                                booking.status === 'Completed'
                                        }">

                                        {{ booking.status }}

                                    </span>

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    </div>

    `

};