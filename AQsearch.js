globalThis.api_key_two = "db9c36870967334b792cbdecc9527b5b4c834a90";

export async function getSearchData() {
    const input = document.querySelector("#getInput").value.trim();
    if (!input) return;

    try {
        // Fetch search data from AQI API
        const response = await fetch(`https://api.waqi.info/search/?token=${api_key_two}&keyword=${input}`);
        const search = await response.json();
        if (!search.data) throw new Error("No data found.");

        const aqis = search.data;

        // Function to categorize AQI data
        const getCategorisedData = aqi => {
            let className = 'unknown';
            let impact = 'Unknown';

            if (aqi >= 0 && aqi <= 50) {
                impact = 'Good';
                className = 'good';
            } else if (aqi <= 100) {
                impact = 'Moderate';
                className = 'moderate';
            } else if (aqi <= 150) {
                impact = 'Unhealthy for Sensitive Groups';
                className = 'unhealthy-sensitive';
            } else if (aqi <= 200) {
                impact = 'Unhealthy';
                className = 'unhealthy';
            } else if (aqi <= 300) {
                impact = 'Very Unhealthy';
                className = 'very-unhealthy';
            } else if (aqi > 300) {
                impact = 'Hazardous';
                className = 'hazardous';
            }

            return { impact, className };
        };

        let html = "";
        if (aqis.length !== 0) {
            html += `<table class="table table-striped table-bordered" id="searchResults">
                        <thead class="thead-dark">
                            <tr>
                                <th>Station</th>
                                <th>City</th>
                                <th>AQI</th>
                                <th>Impact</th>
                                <th>Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>`;

            // Loop through each station's AQI data and display
            aqis.forEach(item => {
                const aqi = item.aqi;
                const station = item.station.name;
                const time = new Date(item.time.stime.replace(/-/g, '/')).toLocaleTimeString('en-US');
                const category = getCategorisedData(aqi);

                html += `<tr class="${category.className}">
                            <td>${station}</td>
                            <td>${input}</td>
                            <td>${aqi}</td>
                            <td>${category.impact}</td>
                            <td>${time}</td>
                        </tr>`;
            });

            html += `</tbody></table>`;
        } else {
            html = `<div class="alert alert-warning" role="alert">No results found for "${input}".</div>`;
        }

        // Replace content with the new HTML
        const def = document.querySelector("#content");
        def.innerHTML = html;

        // Hide other tables if they exist
        const otherTable = document.getElementById('aqiTable');
        if (otherTable) otherTable.style.display = "none";
    } catch (error) {
        console.error("Error fetching search data:", error);
        alert("Failed to load search data. Please try again later.");
    }
}

// Add event listener for search button
document.querySelector("#btn2").addEventListener('click', getSearchData, false);
