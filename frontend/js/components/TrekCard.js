const TrekCard = {

    props: ["trek", "staffList"],

    data() {

        return {

            selectedStaff: ""

        };

    },


    methods: {

        async assignStaff() {

            if (!this.selectedStaff) {

                alert("Please select a staff member.");

                return;

            }


            try {

                const response = await fetch(

                    `http://127.0.0.1:5000/api/admin/treks/${this.trek.id}/assign-staff`,

                    {

                        method: "PUT",

                        credentials: "include",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        body: JSON.stringify({

                            staff_id: this.selectedStaff

                        })

                    }

                );


                const data = await response.json();


                if (response.ok) {

                    alert(data.message);

                    // Refresh the trek data in Manage Treks
                    this.$emit("staff-assigned");

                    // Clear selection
                    this.selectedStaff = "";

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

    <div
        class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-4">

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
                    <strong>Slots:</strong>

                    {{ trek.available_slots }}
                    /
                    {{ trek.total_slots }}

                </p>


                <hr>


                <!-- DATES -->

                <p class="mb-1">

                    📅
                    <strong>Start:</strong>

                    {{ trek.start_date }}

                </p>


                <p class="mb-3">

                    🏁
                    <strong>End:</strong>

                    {{ trek.end_date }}

                </p>


                <!-- STAFF -->

                <p class="mb-3">

                    👤
                    <strong>Assigned Staff:</strong>

                    {{ trek.staff_name || "Not Assigned" }}

                </p>


                <!-- STAFF ASSIGNMENT -->

                <div
                    v-if="trek.status === 'Open'"
                    class="mb-3">

                    <label class="form-label">

                        Staff

                    </label>


                    <select
                        class="form-select"
                        v-model="selectedStaff">

                        <option value="">

                            Select Staff

                        </option>


                        <option
                            v-for="staff in staffList"
                            :key="staff.id"
                            :value="staff.id">

                            {{ staff.name }}

                        </option>

                    </select>

                </div>


                <!-- ACTIONS -->

                <div class="mt-auto">

                    <div class="d-grid gap-2">


                        <!-- UPDATE -->

                        <button
                            class="btn btn-outline-primary btn-sm"
                            @click="$emit(
                                'update-trek',
                                trek
                            )">

                            ✏️ Update Trek

                        </button>


                        <!-- ASSIGN / REPLACE STAFF -->

                        <button
                            v-if="trek.status === 'Open'"
                            class="btn btn-outline-success btn-sm"
                            @click="assignStaff">

                            👤 Assign / Replace Staff

                        </button>


                        <!-- DELETE -->

                        <button
                            class="btn btn-outline-danger btn-sm"
                            @click="$emit(
                                'delete-trek',
                                trek.id
                            )">

                            🗑 Delete Trek

                        </button>


                    </div>

                </div>


            </div>

        </div>

    </div>

    `

};