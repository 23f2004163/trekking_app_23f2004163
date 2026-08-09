const StaffUpdate = {

    props: ["trek"],

    data() {

        return {

            total_slots: this.trek.total_slots,

            status: this.trek.status,

            updating: false

        };

    },


    methods: {

        async updateTrek() {

            if (this.updating) {

                return;

            }


            // Basic slot validation

            if (
                !this.total_slots ||
                this.total_slots < 1
            ) {

                alert(
                    "Total slots must be greater than zero."
                );

                return;

            }


            // Only these statuses are allowed
            const allowedStatuses = [
                "Open",
                "Started",
                "Completed"
            ];


            if (
                !allowedStatuses.includes(
                    this.status
                )
            ) {

                alert("Invalid trek status.");

                return;

            }


            try {

                this.updating = true;


                const response = await fetch(

                    `http://127.0.0.1:5000/api/staff/treks/${this.trek.id}`,

                    {

                        method: "PUT",

                        credentials: "include",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            total_slots:
                                this.total_slots,

                            status:
                                this.status

                        })

                    }

                );


                const data =
                    await response.json();


                if (response.ok) {

                    alert(data.message);


                    // Return to Staff Dashboard

                    this.$emit(
                        "navigate",
                        "staff-dashboard"
                    );

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

                this.updating = false;

            }

        }

    },


    template: `

    <navbar-component

        :role="'staff'"

        @logout="$emit('logout')"

        @navigate="
            $emit('navigate', $event)
        ">

    </navbar-component>


    <div
        class="container"
        style="
            padding-top:100px;
            max-width:650px;
        ">


        <div class="card shadow">


            <div class="card-body">


                <h3 class="text-center mb-4">

                    Update Trek

                </h3>


                <!-- TREK INFORMATION -->

                <div class="alert alert-light border">

                    <h5 class="fw-bold mb-2">

                        {{ trek.title }}

                    </h5>


                    <p class="mb-1">

                        📍
                        <strong>Location:</strong>

                        {{ trek.location }}

                    </p>


                    <p class="mb-1">

                        📅
                        <strong>Start:</strong>

                        {{ trek.start_date }}

                    </p>


                    <p class="mb-0">

                        🏁
                        <strong>End:</strong>

                        {{ trek.end_date }}

                    </p>

                </div>


                <form
                    @submit.prevent="updateTrek">


                    <!-- TOTAL SLOTS -->

                    <div class="mb-4">

                        <label
                            class="form-label fw-bold">

                            Total Slots

                        </label>


                        <input

                            type="number"

                            class="form-control"

                            min="1"

                            v-model.number="
                                total_slots
                            "

                            required>


                        <small
                            class="text-muted">

                            Current registered users:

                            {{ trek.registered_users }}

                        </small>

                    </div>


                    <!-- STATUS -->

                    <div class="mb-4">

                        <label
                            class="form-label fw-bold">

                            Trek Status

                        </label>


                        <select

                            class="form-select"

                            v-model="status"

                            required>


                            <option
                                value="Open">

                                Open

                            </option>


                            <option
                                value="Started">

                                Started

                            </option>


                            <option
                                value="Completed">

                                Completed

                            </option>


                        </select>


                        <small
                            class="text-muted">

                            Status progression:

                            Open → Started → Completed

                        </small>

                    </div>


                    <!-- CURRENT SLOT INFORMATION -->

                    <div
                        class="alert alert-info">

                        <div class="d-flex justify-content-between">

                            <span>

                                Registered Users

                            </span>


                            <strong>

                                {{ trek.registered_users }}

                            </strong>

                        </div>


                        <div
                            class="d-flex justify-content-between">

                            <span>

                                Current Available Slots

                            </span>


                            <strong>

                                {{ trek.available_slots }}

                            </strong>

                        </div>


                        <div
                            class="d-flex justify-content-between">

                            <span>

                                Current Total Slots

                            </span>


                            <strong>

                                {{ trek.total_slots }}

                            </strong>

                        </div>

                    </div>


                    <!-- BUTTONS -->

                    <div
                        class="
                            d-flex
                            justify-content-between
                            mt-4
                        ">


                        <button

                            type="button"

                            class="btn btn-secondary"

                            :disabled="updating"

                            @click="
                                $emit(
                                    'navigate',
                                    'staff-dashboard'
                                )
                            ">

                            Cancel

                        </button>


                        <button

                            type="submit"

                            class="btn btn-primary"

                            :disabled="updating">


                            <span
                                v-if="updating">

                                Updating...

                            </span>


                            <span
                                v-else>

                                Update Trek

                            </span>


                        </button>


                    </div>


                </form>


            </div>

        </div>

    </div>

    `

};