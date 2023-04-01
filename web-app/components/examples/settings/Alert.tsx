export default function Alert() {
    return (
        <>
            <div
                className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 xl:mb-0">
                <div className="flow-root">
                    <h3 className="text-xl font-semibold dark:text-white">Alerts &amp; Notifications</h3>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">You can set up
                        Themesberg to get notifications</p>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {/* Item 1 */}
                        <div className="flex items-center justify-between py-4">
                            <div className="flex flex-col flex-grow">
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">Company
                                    News
                                </div>
                                <div className="text-base font-normal text-gray-500 dark:text-gray-400">Get
                                    Themesberg news, announcements, and product updates
                                </div>
                            </div>
                            <label htmlFor="company-news" className="relative flex items-center cursor-pointer">
                                <input type="checkbox" id="company-news" className="sr-only"/>
                                <span
                                    className="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"/>
                            </label>
                        </div>
                        {/* Item 2 */}
                        <div className="flex items-center justify-between py-4">
                            <div className="flex flex-col flex-grow">
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">Account
                                    Activity
                                </div>
                                <div className="text-base font-normal text-gray-500 dark:text-gray-400">Get
                                    important notifications about you or activity you've missed
                                </div>
                            </div>
                            <label htmlFor="account-activity"
                                   className="relative flex items-center cursor-pointer">
                                <input type="checkbox" id="account-activity" className="sr-only"
                                       defaultChecked/>
                                <span
                                    className="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"/>
                            </label>
                        </div>
                        {/* Item 3 */}
                        <div className="flex items-center justify-between py-4">
                            <div className="flex flex-col flex-grow">
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">Meetups
                                    Near You
                                </div>
                                <div className="text-base font-normal text-gray-500 dark:text-gray-400">Get an
                                    email when a Dribbble Meetup is posted close to my location
                                </div>
                            </div>
                            <label htmlFor="meetups" className="relative flex items-center cursor-pointer">
                                <input type="checkbox" id="meetups" className="sr-only" defaultChecked/>
                                <span
                                    className="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"/>
                            </label>
                        </div>
                        {/* Item 4 */}
                        <div className="flex items-center justify-between pt-4">
                            <div className="flex flex-col flex-grow">
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">New
                                    Messages
                                </div>
                                <div className="text-base font-normal text-gray-500 dark:text-gray-400">Get
                                    Themsberg news, announcements, and product updates
                                </div>
                            </div>
                            <label htmlFor="new-messages" className="relative flex items-center cursor-pointer">
                                <input type="checkbox" id="new-messages" className="sr-only"/>
                                <span
                                    className="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"/>
                            </label>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Default
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}