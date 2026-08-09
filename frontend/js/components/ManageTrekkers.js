const ManageTrekkers = {

    data() {

        return {

            users: []

        };

    },


    methods: {

        async getAllUsers() {

            try {

                const response = await fetch(
                    "http://127.0.0.1:5000/api/admin/users",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const data = await response.json();

                if (response.ok) {

                    this.users = data.users.map(user => ({
                        ...user,
                        selectedStatus: user.status
                    }));

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


        async updateStatus(user) {

            try {

                const response = await fetch(

                    `http://127.0.0.1:5000/api/admin/users/${user.id}/status`,

                    {

                        method: "PUT",

                        credentials: "include",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        body: JSON.stringify({

                            status: user.selectedStatus

                        })

                    }

                );

                const data = await response.json();

                if (response.ok) {

                    user.status = user.selectedStatus;

                    alert(data.message);

                }

                else {

                    user.selectedStatus = user.status;

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

        this.getAllUsers();

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

                Trekker Management

            </h2>

        </div>


        <table
            v-if="users.length > 0"
            class="table table-striped table-hover shadow-sm">


            <thead class="table-dark">

                <tr>

                    <th>
                        ID
                    </th>

                    <th>
                        Name
                    </th>

                    <th>
                        Email
                    </th>

                    <th>
                        Status
                    </th>

                    <th>
                        Action
                    </th>

                </tr>

            </thead>


            <tbody>


                <tr
                    v-for="user in users"
                    :key="user.id">


                    <td>

                        {{ user.id }}

                    </td>


                    <td>

                        {{ user.name }}

                    </td>


                    <td>

                        {{ user.email }}

                    </td>


                    <td>

                        <span
                            class="badge"
                            :class="{
                                'bg-success':
                                    user.status === 'approved',

                                'bg-warning text-dark':
                                    user.status === 'deactivated',

                                'bg-danger':
                                    user.status === 'blacklisted'
                            }">

                            {{ user.status }}

                        </span>

                    </td>


                    <td>

                        <div
                            class="d-flex align-items-center gap-2">


                            <select
                                class="form-select form-select-sm"
                                style="width:160px"
                                v-model="user.selectedStatus">


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
                                class="btn btn-success btn-sm"
                                @click="updateStatus(user)">

                                Save

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

                No Trekkers Available

            </h5>

        </div>


    </div>

    `

};