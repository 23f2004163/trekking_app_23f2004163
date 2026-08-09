const Admin = {

    data() {

        return {

            statistics: {

                total_treks: 0,
                total_users: 0,
                total_staff: 0,
                total_bookings: 0

            },

            currentBookings: [],

            currentBookingsLoading: true

        };

    },


    methods: {

        async getDashboardStatistics() {

            try {

                const response = await fetch(
                    "http://127.0.0.1:5000/api/admin/dashboard",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const data = await response.json();

                if (response.ok) {

                    this.statistics = data;

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


        async getCurrentBookings() {

            try {

                const response = await fetch(
                    "http://127.0.0.1:5000/api/admin/current-bookings",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const data = await response.json();

                if (response.ok) {

                    this.currentBookings = data.bookings;

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

                this.currentBookingsLoading = false;

            }

        }

    },


    mounted() {

        this.getDashboardStatistics();

        this.getCurrentBookings();

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

        <h2 class="mb-4">

            Admin Dashboard

        </h2>


        <!-- STATISTICS -->

        <div class="row g-3">


            <div class="col-md-3">

                <div class="card shadow-sm text-center h-100">

                    <div class="card-body">

                        <h6>Total Treks</h6>

                        <h1 class="fw-bold">

                            {{ statistics.total_treks }}

                        </h1>

                    </div>

                </div>

            </div>


            <div class="col-md-3">

                <div class="card shadow-sm text-center h-100">

                    <div class="card-body">

                        <h6>Total Users</h6>

                        <h1 class="fw-bold">

                            {{ statistics.total_users }}

                        </h1>

                    </div>

                </div>

            </div>


            <div class="col-md-3">

                <div class="card shadow-sm text-center h-100">

                    <div class="card-body">

                        <h6>Total Staff</h6>

                        <h1 class="fw-bold">

                            {{ statistics.total_staff }}

                        </h1>

                    </div>

                </div>

            </div>


            <div class="col-md-3">

                <div class="card shadow-sm text-center h-100">

                    <div class="card-body">

                        <h6>Total Bookings</h6>

                        <h1 class="fw-bold">

                            {{ statistics.total_bookings }}

                        </h1>

                    </div>

                </div>

            </div>


        </div>


        <!-- CURRENT BOOKINGS -->

        <div class="card shadow border-0 mt-5">


            <div class="card-body">


                <div
                    class="d-flex justify-content-between align-items-center mb-4">

                    <h4 class="fw-bold mb-0">

                        Current Bookings

                    </h4>

                    <span class="badge bg-success">

                        Active

                    </span>

                </div>


                <!-- LOADING -->

                <div
                    v-if="currentBookingsLoading"
                    class="text-center py-4">

                    <div
                        class="spinner-border"
                        role="status">
                    </div>

                    <p class="mt-2 mb-0">

                        Loading current bookings...

                    </p>

                </div>


                <!-- NO BOOKINGS -->

                <div
                    v-else-if="currentBookings.length === 0"
                    class="text-center py-4 text-muted">

                    <h5>

                        No Current Bookings

                    </h5>

                    <p class="mb-0">

                        There are currently no active bookings.

                    </p>

                </div>


                <!-- BOOKINGS TABLE -->

                <div
                    v-else
                    class="table-responsive">

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
                                    Staff
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
                                v-for="booking in currentBookings"
                                :key="booking.booking_id">


                                <td>

                                    #{{ booking.booking_id }}

                                </td>


                                <td>

                                    {{ booking.user_name }}

                                </td>


                                <td>

                                    {{ booking.trek_title }}

                                </td>


                                <td>

                                    {{ booking.staff_name }}

                                </td>


                                <td>

                                    {{ booking.booking_date }}

                                </td>


                                <td>

                                    <span
                                        class="badge bg-success">

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