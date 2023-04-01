export default function Language() {
    return (
        <>
            <div
                className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                <h3 className="mb-4 text-xl font-semibold dark:text-white">Language &amp; Time</h3>
                <div className="mb-4">
                    <label htmlFor="settings-language"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select
                        language</label>
                    <select id="settings-language" name="countries"
                            className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                        <option>English (US)</option>
                        <option>Italiano</option>
                        <option>Français (France)</option>
                        <option>正體字</option>
                        <option>Español (España)</option>
                        <option>Deutsch</option>
                        <option>Português (Brasil)</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label htmlFor="settings-timezone"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Time
                        Zone</label>
                    <select id="settings-timezone" name="countries"
                            className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                        <option>GMT+0 Greenwich Mean Time (GMT)</option>
                        <option>GMT+1 Central European Time (CET)</option>
                        <option>GMT+2 Eastern European Time (EET)</option>
                        <option>GMT+3 Moscow Time (MSK)</option>
                        <option>GMT+5 Pakistan Standard Time (PKT)</option>
                        <option>GMT+8 China Standard Time (CST)</option>
                        <option>GMT+10 Eastern Australia Standard Time (AEST)</option>
                    </select>
                </div>
                <div>
                    <button type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Default
                    </button>
                </div>
            </div>
        </>
    )
}