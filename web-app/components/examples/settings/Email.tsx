export default function Email() {
    return (
        <>
            <div
                className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 xl:mb-0">
                <div className="flow-root">
                    <h3 className="text-xl font-semibold dark:text-white">Email Notifications</h3>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">You can set up
                        Themesberg to get email notifications </p>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {/* Item 1 */}
                        <div className="flex items-center justify-between py-4">
                            <div className="flex flex-col flex-grow">
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">Rating
                                    reminders
                                </div>
                                <div className="text-base font-normal text-gray-500 dark:text-gray-400">Send an
                                    email reminding me to rate an item a week after purchase
                                </div>
                            </div>
                            <label htmlFor="rating-reminders"
                                   className="relative flex items-center cursor-pointer">
                                <input type="checkbox" id="rating-reminders" className="sr-only"/>
                                <span
                                    className="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"/>
                            </label>
                        </div>
                        {/* Item 2 */}
                        <div className="flex items-center justify-between py-4">
                            <div className="flex flex-col flex-grow">
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">Item update
                                    notifications
                                </div>
                                <div className="text-base font-normal text-gray-500 dark:text-gray-400">Send
                                    user and product notifications for you
                                </div>
                            </div>
                            <label htmlFor="item-update" className="relative flex items-center cursor-pointer">
                                <input type="checkbox" id="item-update" className="sr-only" defaultChecked/>
                                <span
                                    className="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"/>
                            </label>
                        </div>
                        {/* Item 3 */}
                        <div className="flex items-center justify-between py-4">
                            <div className="flex flex-col flex-grow">
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">Item
                                    comment notifications
                                </div>
                                <div className="text-base font-normal text-gray-500 dark:text-gray-400">Send me
                                    an email when someone comments on one of my items
                                </div>
                            </div>
                            <label htmlFor="item-comment" className="relative flex items-center cursor-pointer">
                                <input type="checkbox" id="item-comment" className="sr-only" defaultChecked/>
                                <span
                                    className="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600"/>
                            </label>
                        </div>
                        {/* Item 4 */}
                        <div className="flex items-center justify-between pt-4">
                            <div className="flex flex-col flex-grow">
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">Buyer
                                    review notifications
                                </div>
                                <div className="text-base font-normal text-gray-500 dark:text-gray-400">Send me
                                    an email when someone leaves a review with their rating
                                </div>
                            </div>
                            <label htmlFor="buyer-rev" className="relative flex items-center cursor-pointer">
                                <input type="checkbox" id="buyer-rev" className="sr-only"/>
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