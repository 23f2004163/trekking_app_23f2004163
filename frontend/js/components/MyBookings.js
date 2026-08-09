const MyBookings = {

    data() {

        return {

            bookings: [],

            loading: true,

            cancellingBookingId: null,

            exporting: false

        };

    },


    methods: {

        // GET MY BOOKINGS

        async getMyBookings() {

            try {

                const response = await fetch(

                    "http://127.0.0.1:5000/api/user/bookings",

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

                alert(
                    "Unable to connect to server."
                );

            }


            finally {

                this.loading = false;

            }

        },


        
        // CANCEL BOOKING
        

        async cancelBooking(booking) {

            if (this.cancellingBookingId) {

                return;

            }


            const confirmed = confirm(

                "Are you sure you want to cancel this booking?"

            );


            if (!confirmed) {

                return;

            }


            try {

                this.cancellingBookingId =
                    booking.booking_id;


                const response = await fetch(

                    `http://127.0.0.1:5000/api/user/bookings/${booking.booking_id}/cancel`,

                    {

                        method: "PUT",

                        credentials: "include",

                        headers: {

                            "Content-Type":
                                "application/json"

                        }

                    }

                );


                const data =
                    await response.json();


                if (response.ok) {

                    alert(data.message);

                    await this.getMyBookings();

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

                this.cancellingBookingId = null;

            }

        },


       
        // EXPORT BOOKING HISTORY
        

        async exportBookingHistory() {

            if (this.exporting) {

                return;

            }


            try {

                this.exporting = true;


                console.log(
                    "1. Starting export..."
                );


               
                // START CELERY JOB
                

                const response = await fetch(

                    "http://127.0.0.1:5000/api/user/export-booking-history",

                    {

                        method: "POST",

                        credentials: "include"

                    }

                );


                const data =
                    await response.json();


                console.log(
                    "2. Export API response:",
                    data
                );


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Failed to start export."
                    );

                    return;

                }


                console.log(
                    "3. Celery Task ID:",
                    data.task_id
                );


                
                // WAIT FOR CELERY

                console.log(
                    "4. Waiting 5 seconds for Celery..."
                );


                await new Promise(

                    resolve =>
                        setTimeout(resolve, 5000)

                );


                console.log(
                    "5. Starting download request..."
                );


                // DOWNLOAD CSV
                
                const downloadResponse =
                    await fetch(

                        "http://127.0.0.1:5000/api/user/download-booking-history",

                        {

                            method: "GET",

                            credentials: "include"

                        }

                    );


                console.log(

                    "6. Download response status:",

                    downloadResponse.status

                );


                
                // DOWNLOAD FAILED
               
                if (!downloadResponse.ok) {

                    let errorData;


                    try {

                        errorData =
                            await downloadResponse.json();

                    }

                    catch {

                        errorData = {

                            message:
                                "Unable to download booking history."

                        };

                    }


                    console.error(

                        "Download error:",

                        errorData

                    );


                    alert(

                        errorData.message

                    );


                    return;

                }


                
                // FILE RECEIVED
               
                console.log(

                    "7. File received successfully!"

                );


                const blob =
                    await downloadResponse.blob();


                console.log(

                    "8. Blob size:",

                    blob.size

                );


                
                // CREATE DOWNLOAD LINK
                

                const url =
                    window.URL.createObjectURL(blob);


                const link =
                    document.createElement("a");


                link.href = url;


                link.download =
                    "booking_history.csv";


                link.style.display = "none";


                document.body.appendChild(link);


                link.click();


                document.body.removeChild(link);


                

                setTimeout(() => {

                    window.URL.revokeObjectURL(url);

                }, 100);


                console.log(

                    "9. Download triggered successfully!"

                );


                alert(

                    "Booking history downloaded successfully!"

                );

            }


            catch (error) {

                console.error(

                    "EXPORT ERROR:",

                    error

                );


                alert(

                    "Unable to export booking history."

                );

            }


            finally {

                this.exporting = false;

            }

        }

    },


    
    // COMPONENT MOUNTED
   

    mounted() {

        this.getMyBookings();

    },


   
    

    template: `

    <navbar-component

        :role="'trekker'"

        @logout="$emit('logout')"

        @navigate="$emit('navigate', $event)">

    </navbar-component>


    <div

        class="container"

        style="padding-top:100px;">


        <!-- =========================================
             HEADER
        ========================================== -->

        <div

            class="d-flex justify-content-between align-items-center mb-4">


            <h2>

                My Bookings

            </h2>


            <!-- EXPORT BUTTON -->

            <button

                type="button"

                class="btn btn-success"

                :disabled="exporting"

                @click="exportBookingHistory">


                <span v-if="exporting">

                    Exporting...

                </span>


                <span v-else>

                    📄 Export Booking History

                </span>


            </button>


        </div>


        <!-- =========================================
             LOADING
        ========================================== -->

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


        <!-- =========================================
             NO BOOKINGS
        ========================================== -->

        <div

            v-else-if="bookings.length === 0"

            class="text-center mt-5">


            <h5>

                No Bookings Found

            </h5>


            <p class="text-muted">

                You have not booked any treks yet.

            </p>


        </div>


        <!-- =========================================
             BOOKINGS
        ========================================== -->

        <div

            v-else

            class="row g-4">


            <div

                v-for="booking in bookings"

                :key="booking.booking_id"

                class="col-12 col-sm-6 col-md-6 col-lg-4">


                <div

                    class="card shadow-sm h-100 border-0">


                    <div

                        class="card-body d-flex flex-column">


                        <!-- TITLE + STATUS -->

                        <div

                            class="d-flex justify-content-between align-items-center mb-3">


                            <h5

                                class="fw-bold mb-0">

                                {{ booking.title }}

                            </h5>


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


                        </div>


                        <!-- TREK DETAILS -->

                        <p class="mb-2">

                            📍

                            <strong>Location:</strong>

                            {{ booking.location }}

                        </p>


                        <p class="mb-2">

                            🏔️

                            <strong>Difficulty:</strong>

                            {{ booking.difficulty }}

                        </p>


                        <p class="mb-2">

                            ⏳

                            <strong>Duration:</strong>

                            {{ booking.duration_days }} Days

                        </p>


                        <hr>


                        <!-- DATES -->

                        <p class="mb-2">

                            📅

                            <strong>Start:</strong>

                            {{ booking.start_date }}

                        </p>


                        <p class="mb-2">

                            🏁

                            <strong>End:</strong>

                            {{ booking.end_date }}

                        </p>


                        <p class="mb-3">

                            📝

                            <strong>Booking Date:</strong>

                            {{ booking.booking_date }}

                        </p>


                        <hr>


                        <!-- STAFF DETAILS -->

                        <h6 class="fw-bold mb-3">

                            👤 Trek Staff

                        </h6>


                        <p class="mb-2">

                            <strong>Name:</strong>

                            {{ booking.staff_name || "Not Assigned" }}

                        </p>


                        <p class="mb-3">

                            📞

                            <strong>Contact:</strong>

                            {{ booking.staff_contact || "Not Available" }}

                        </p>


                        <!-- =================================
                             CANCEL BUTTON
                        ================================== -->

                        <div

                            v-if="booking.status === 'Booked'"

                            class="mt-auto pt-3">


                            <button

                                type="button"

                                class="btn btn-outline-danger w-100"

                                :disabled="

                                    cancellingBookingId ===

                                    booking.booking_id

                                "

                                @click="cancelBooking(booking)">


                                <span

                                    v-if="

                                        cancellingBookingId ===

                                        booking.booking_id

                                    ">

                                    Cancelling...

                                </span>


                                <span v-else>

                                    ❌ Cancel Booking

                                </span>


                            </button>


                        </div>


                    </div>

                </div>


            </div>


        </div>


    </div>

    `

};