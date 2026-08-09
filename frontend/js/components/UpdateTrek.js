const UpdateTrek = {

    props: ["trek"],

    data() {

        return {

            title: this.trek.title,

            description: this.trek.description,

            location: this.trek.location,

            difficulty: this.trek.difficulty,

            duration_days: this.trek.duration_days,

            total_slots: this.trek.total_slots,

            start_date: this.formatDate(
                this.trek.start_date
            ),

            end_date: this.formatDate(
                this.trek.end_date
            ),

            status: this.trek.status

        };

    },


    methods: {

        formatDate(date) {

            // Converts DD-MM-YYYY to YYYY-MM-DD

            if (date && date.includes("-")) {

                const parts = date.split("-");

                if (parts[0].length === 2) {

                    return `${parts[2]}-${parts[1]}-${parts[0]}`;

                }

            }

            return date;

        },


        async updateTrek() {

            try {

                const response = await fetch(

                    `http://127.0.0.1:5000/api/admin/treks/${this.trek.id}`,

                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        credentials: "include",

                        body: JSON.stringify({

                            title: this.title,

                            description:
                                this.description,

                            location:
                                this.location,

                            difficulty:
                                this.difficulty,

                            duration_days:
                                this.duration_days,

                            total_slots:
                                this.total_slots,

                            start_date:
                                this.start_date,

                            end_date:
                                this.end_date,

                            status:
                                this.status

                        })

                    }

                );


                const data = await response.json();


                if (response.ok) {

                    alert(data.message);

                    this.$emit(
                        "navigate",
                        "manage-treks"
                    );

                }

                else {

                    alert(data.message);

                }

            }

            catch (error) {

                console.error(error);

                alert(
                    "Unable to connect to server"
                );

            }

        }

    },


    template: `

    <navbar-component

        @logout="$emit('logout')"

        @navigate="$emit('navigate', $event)">

    </navbar-component>


    <div
        class="container"
        style="padding-top:100px; max-width:700px;">


        <div class="card shadow">


            <div class="card-body">


                <h3 class="text-center mb-4">

                    Update Trek

                </h3>


                <form
                    @submit.prevent="updateTrek">


                    <!-- TITLE -->

                    <div class="mb-3">

                        <label class="form-label">

                            Trek Title

                        </label>


                        <input

                            type="text"

                            class="form-control"

                            v-model="title"

                            required>

                    </div>


                    <!-- DESCRIPTION -->

                    <div class="mb-3">

                        <label class="form-label">

                            Description

                        </label>


                        <textarea

                            class="form-control"

                            rows="3"

                            v-model="description">

                        </textarea>

                    </div>


                    <!-- LOCATION -->

                    <div class="mb-3">

                        <label class="form-label">

                            Location

                        </label>


                        <input

                            type="text"

                            class="form-control"

                            v-model="location"

                            required>

                    </div>


                    <!-- DIFFICULTY -->

                    <div class="mb-3">

                        <label class="form-label">

                            Difficulty

                        </label>


                        <select

                            class="form-select"

                            v-model="difficulty"

                            required>


                            <option value="Easy">

                                Easy

                            </option>


                            <option value="Moderate">

                                Moderate

                            </option>


                            <option value="Hard">

                                Hard

                            </option>


                        </select>

                    </div>


                    <!-- STATUS -->

                    <div class="mb-3">

                        <label class="form-label">

                            Status

                        </label>


                        <select

                            class="form-select"

                            v-model="status"

                            required>


                            <option value="Open">

                                Open

                            </option>


                            <option value="Closed">

                                Closed

                            </option>


                        </select>


                        <small class="text-muted">

                            Started and Completed statuses
                            are managed by staff.

                        </small>

                    </div>


                    <!-- DURATION + SLOTS -->

                    <div class="row">


                        <div class="col-md-6">


                            <div class="mb-3">


                                <label class="form-label">

                                    Duration (Days)

                                </label>


                                <input

                                    type="number"

                                    class="form-control"

                                    min="1"

                                    v-model.number="
                                        duration_days
                                    "

                                    required>

                            </div>


                        </div>


                        <div class="col-md-6">


                            <div class="mb-3">


                                <label class="form-label">

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

                            </div>


                        </div>


                    </div>


                    <!-- DATES -->

                    <div class="row">


                        <div class="col-md-6">


                            <div class="mb-3">


                                <label class="form-label">

                                    Start Date

                                </label>


                                <input

                                    type="date"

                                    class="form-control"

                                    v-model="start_date"

                                    required>

                            </div>


                        </div>


                        <div class="col-md-6">


                            <div class="mb-3">


                                <label class="form-label">

                                    End Date

                                </label>


                                <input

                                    type="date"

                                    class="form-control"

                                    v-model="end_date"

                                    required>

                            </div>


                        </div>


                    </div>


                    <!-- BUTTONS -->

                    <div
                        class="d-flex justify-content-between mt-4">


                        <button

                            type="button"

                            class="btn btn-secondary"

                            @click="
                                $emit(
                                    'navigate',
                                    'manage-treks'
                                )
                            ">

                            Cancel

                        </button>


                        <button

                            type="submit"

                            class="btn btn-primary">

                            Update Trek

                        </button>


                    </div>


                </form>


            </div>

        </div>

    </div>

    `

};