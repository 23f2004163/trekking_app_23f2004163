const CreateTrek = {

    data() {

        return {

            title: "",
            description: "",
            location: "",
            difficulty: "",
            duration_days: "",
            total_slots: "",
            start_date: "",
            end_date: ""

        };

    },

    methods: {

        async createTrek() {

            try {

                const response = await fetch(
                    "http://127.0.0.1:5000/api/admin/treks",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({

                            title: this.title,
                            description: this.description,
                            location: this.location,
                            difficulty: this.difficulty,
                            duration_days: this.duration_days,
                            total_slots: this.total_slots,
                            start_date: this.start_date,
                            end_date: this.end_date

                        })

                    }
                );

                const data = await response.json();

                if (response.ok) {

                    alert(data.message);

                    this.title = "";
                    this.description = "";
                    this.location = "";
                    this.difficulty = "";
                    this.duration_days = "";
                    this.total_slots = "";
                    this.start_date = "";
                    this.end_date = "";

                    this.$emit("navigate", "manage-treks");

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
    :role="'admin'"
    @logout="$emit('logout')"
    @navigate="$emit('navigate', $event)">
</navbar-component>

<div class="container-fluid bg-light" style="min-height:100vh; padding-top:100px; padding-bottom:40px;">

    <div class="container" style="max-width:850px;">

        <div class="card shadow-lg border-0 rounded-4">

            <div class="card-body p-5">

                <h2 class="text-center fw-bold mb-2">

                    Create Trek

                </h2>

                <p class="text-center text-muted mb-4">

                    Fill in the trek details below.

                </p>

                <form @submit.prevent="createTrek">

                    <div class="mb-3">

                        <label class="form-label fw-semibold">

                            Trek Title

                        </label>

                        <input
                            type="text"
                            class="form-control"
                            v-model="title"
                            required>

                    </div>

                    <div class="mb-4">

                        <label class="form-label fw-semibold">

                            Description (Optional)

                        </label>

                        <textarea
                            class="form-control"
                            rows="3"
                            v-model="description"
                            placeholder="Enter trek description">

                        </textarea>

                    </div>

                    <div class="mb-3">

                        <label class="form-label fw-semibold">

                            Location

                        </label>

                        <input
                            type="text"
                            class="form-control"
                            v-model="location"
                            required>

                    </div>

                    <div class="mb-4">

                        <label class="form-label fw-semibold">

                            Difficulty

                        </label>

                        <select
                            class="form-select"
                            v-model="difficulty"
                            required>

                            <option value="">Select Difficulty</option>
                            <option value="Easy">Easy</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Hard">Hard</option>

                        </select>

                    </div>

                    <div class="row">

                        <div class="col-md-6 mb-3">

                            <label class="form-label fw-semibold">

                                Duration (Days)

                            </label>

                            <input
                                type="number"
                                class="form-control"
                                min="1"
                                v-model.number="duration_days"
                                required>

                        </div>

                        <div class="col-md-6 mb-3">

                            <label class="form-label fw-semibold">

                                Total Slots

                            </label>

                            <input
                                type="number"
                                class="form-control"
                                min="1"
                                v-model.number="total_slots"
                                required>

                        </div>

                    </div>

                    <div class="row">

                        <div class="col-md-6 mb-3">

                            <label class="form-label fw-semibold">

                                Start Date

                            </label>

                            <input
                                type="date"
                                class="form-control"
                                v-model="start_date"
                                required>

                        </div>

                        <div class="col-md-6 mb-3">

                            <label class="form-label fw-semibold">

                                End Date

                            </label>

                            <input
                                type="date"
                                class="form-control"
                                v-model="end_date"
                                required>

                        </div>

                    </div>

                    <hr class="my-4">

                    <div class="d-flex justify-content-between">

                        <button
                            type="button"
                            class="btn btn-outline-secondary px-4"
                            @click="$emit('navigate','manage-treks')">

                            Cancel

                        </button>

                        <button
                            type="submit"
                            class="btn btn-success px-5">

                            Create Trek

                        </button>

                    </div>

                </form>

            </div>

        </div>

    </div>

</div>

`

};