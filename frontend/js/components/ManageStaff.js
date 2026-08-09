const ManageStaff = {

    data() {

        return {

            staff: []

        };

    },

    methods: {

        async getAllStaff() {

            try {

                const response = await fetch(
                    "http://127.0.0.1:5000/api/admin/staff",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const data = await response.json();

                if (response.ok) {

                    this.staff = data.staff.map(member => (
                        {...member,
                            selectedStatus: member.status
                        }
                    ));

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

        async updateStaffStatus(member) {

            try {

                const response = await fetch(

                    `http://127.0.0.1:5000/api/admin/staff/${member.id}/status`,

                    {

                        method: "PUT",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        credentials: "include",

                        body: JSON.stringify({

                            status: member.selectedStatus

                        })

                    }

                );

                const data = await response.json();

                if (response.ok) {

                    alert(data.message);

                    this.getAllStaff();

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

        async deleteStaff(member) {

            const confirmDelete = confirm(

                `Are you sure you want to delete ${member.name}?`

            );

            if (!confirmDelete) {

                return;

            }

            try {

                const response = await fetch(

                    `http://127.0.0.1:5000/api/admin/staff/${member.id}`,

                    {

                        method: "DELETE",

                        credentials: "include"

                    }

                );

                const data = await response.json();

                if (response.ok) {

                    alert(data.message);

                    this.getAllStaff();

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

    mounted() {

        this.getAllStaff();

    },

    template: `

    <navbar-component
        :role="'admin'"
        @logout="$emit('logout')"
        @navigate="$emit('navigate', $event)">
    </navbar-component>

    <div class="container" style="padding-top:100px;">

        <div class="d-flex justify-content-between align-items-center mb-4">

            <h2>

                Staff Management

            </h2>

            <button
                class="btn btn-success"
                @click="$emit('navigate','create-staff')">

                + Create Staff

            </button>

        </div>

        <table
            v-if="staff.length > 0"
            class="table table-striped table-hover shadow-sm">

            <thead class="table-dark">

                <tr>

                    <th>ID</th>

                    <th>Name</th>

                    <th>Email</th>

                    <th>Contact</th>

                    <th>Status</th>

                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                <tr
                    v-for="member in staff"
                    :key="member.id">

                    <td>{{ member.id }}</td>

                    <td>{{ member.name }}</td>

                    <td>{{ member.email }}</td>

                    <td>{{ member.contact_details }}</td>

                    <td>

                        <span
                            v-if="member.status === 'approved'"
                            class="badge bg-success">

                            Approved

                        </span>

                        <span
                            v-else-if="member.status === 'deactivated'"
                            class="badge bg-warning text-dark">

                            Deactivated

                        </span>

                        <span
                            v-else
                            class="badge bg-danger">

                            Blacklisted

                        </span>

                    </td>

                    <td>

                        <div class="d-flex align-items-center gap-2">

                            <select
                                class="form-select form-select-sm"
                                style="width:160px"
                                v-model="member.selectedStatus">

                                <option value="approved">

                                    Approved

                                </option>

                                <option value="deactivated">

                                    Deactivated

                                </option>

                                <option value="blacklisted">

                                    Blacklisted

                                </option>

                            </select>

                            <button
                                class="btn btn-outline-primary btn-sm"
                                @click="updateStaffStatus(member)">

                                Update

                            </button>

                            <button
                                class="btn btn-outline-danger btn-sm"
                                @click="deleteStaff(member)">

                                Delete

                            </button>

                        </div>

                    </td>

                </tr>

            </tbody>

        </table>

        <div
            v-else
            class="text-center mt-5">

            <h5>

                No Staff Available

            </h5>

        </div>

    </div>

    `

};