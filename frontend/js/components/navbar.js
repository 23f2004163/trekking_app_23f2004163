const Navbar = {

    props: ["currentPage", "role"],

    template: `

    <nav
        class="navbar navbar-expand-lg bg-dark navbar-dark py-3 fixed-top shadow-sm">

        <div class="container">


            <a
                href="#"
                class="navbar-brand d-flex align-items-center">

                <span class="text-uppercase fw-bold fs-4">

                    TrekDeck

                </span>

            </a>


            <button
                class="navbar-toggler border-0"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navMenu">

                <span class="navbar-toggler-icon"></span>

            </button>


            <div
                class="collapse navbar-collapse"
                id="navMenu">

                <ul class="navbar-nav ms-auto text-center">


                    <!-- ================= ADMIN NAVBAR ================= -->

                    <template v-if="role === 'admin'">


                        <li class="nav-item px-2 py-2">

                            <a
                                href="#"
                                class="nav-link text-uppercase"
                                @click.prevent="
                                    $emit(
                                        'navigate',
                                        'dashboard'
                                    )
                                ">

                                Dashboard

                            </a>

                        </li>


                        <li class="nav-item px-2 py-2">

                            <a
                                href="#"
                                class="nav-link text-uppercase"
                                @click.prevent="
                                    $emit(
                                        'navigate',
                                        'manage-treks'
                                    )
                                ">

                                Manage Treks

                            </a>

                        </li>


                        <li class="nav-item px-2 py-2">

                            <a
                                href="#"
                                class="nav-link text-uppercase"
                                @click.prevent="
                                    $emit(
                                        'navigate',
                                        'staff'
                                    )
                                ">

                                Staff

                            </a>

                        </li>


                        <li class="nav-item px-2 py-2">

                            <a
                                href="#"
                                class="nav-link text-uppercase"
                                @click.prevent="
                                    $emit(
                                        'navigate',
                                        'trekkers'
                                    )
                                ">

                                Trekkers

                            </a>

                        </li>


                        <li class="nav-item px-2 py-2">

                            <a
                                href="#"
                                class="nav-link text-uppercase"
                                @click.prevent="
                                    $emit(
                                        'navigate',
                                        'bookings'
                                    )
                                ">

                                Bookings

                            </a>

                        </li>


                    </template>


                    <!-- ================= TREKKER NAVBAR ================= -->

                    <template v-if="role === 'trekker'">


                        <li class="nav-item px-2 py-2">

                            <a
                                href="#"
                                class="nav-link text-uppercase"
                                @click.prevent="
                                    $emit(
                                        'navigate',
                                        'user-dashboard'
                                    )
                                ">

                                Dashboard

                            </a>

                        </li>


                        <li class="nav-item px-2 py-2">

                            <a
                                href="#"
                                class="nav-link text-uppercase"
                                @click.prevent="
                                    $emit(
                                        'navigate',
                                        'my-bookings'
                                    )
                                ">

                                My Bookings

                            </a>

                        </li>


                    </template>


                    <!-- ================= STAFF NAVBAR ================= -->

                    <template v-if="role === 'staff'">


                        <li class="nav-item px-2 py-2">

                            <a
                                href="#"
                                class="nav-link text-uppercase"
                                @click.prevent="
                                    $emit(
                                        'navigate',
                                        'staff-dashboard'
                                    )
                                ">

                                Dashboard

                            </a>

                        </li>


                        


                    </template>


                    <!-- ================= LOGOUT ================= -->

                    <li class="nav-item px-2 py-2">

                        <button
                            class="btn btn-outline-light"
                            @click="$emit('logout')">

                            Logout

                        </button>

                    </li>


                </ul>

            </div>

        </div>

    </nav>

    `

};