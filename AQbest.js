
export async function showBestAQICities() {
    
        const url = `https://api.waqi.info/map/bounds/?token=${api_key_two}&latlng=8.4,68.7,37.6,97.25`; // India bounds

        const response = await fetch(url);
        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            throw new Error("No data found.");
        }

        // Filter for AQI values and likely Indian stations (extra filtering optional)
        const filtered = data.data
            .filter(station => station.aqi !== "-" && !isNaN(station.aqi))
            .filter(station => {
                const name = station.station.name.toLowerCase();
                // Basic filter for Indian city/station names (optional but helpful)
                return name.includes("india") || name.includes("delhi") || name.includes("mumbai") || name.includes("bangalore");
            });

        const sorted = filtered
            .sort((a, b) => a.aqi - b.aqi)
            .slice(0, 30); // Top 30 best AQI

        const getCategorisedData = (aqi) => {
            if (aqi <= 50) return { impact: "Good", className: "good" };
            if (aqi <= 100) return { impact: "Moderate", className: "moderate" };
            if (aqi <= 150) return { impact: "Unhealthy for Sensitive Groups", className: "unhealthy-sensitive" };
            if (aqi <= 200) return { impact: "Unhealthy", className: "unhealthy" };
            if (aqi <= 300) return { impact: "Very Unhealthy", className: "very-unhealthy" };
            return { impact: "Hazardous", className: "hazardous" };
        };

        let html = `<h4 class="mb-3">Top 30 Best AQI Cities in India</h4>`;
        html += `<table class="table table-bordered table-hover" id="aqiTable">
                    <thead class="thead-dark">
                        <tr>
                            <th>City</th>
                            <th>AQI</th>
                            <th>Impact</th>
                        </tr>
                    </thead>
                    <tbody>`;

        sorted.forEach(city => {
            const category = getCategorisedData(city.aqi);
            html += `<tr class="${category.className}">
                        <td>${city.station.name}</td>
                        <td>${city.aqi}</td>
                        <td>${category.impact}</td>
                    </tr>`;
        });

        html += `</tbody></table>`;

        document.querySelector("#content").innerHTML = html;

        // Hide other tables
        const searchTable = document.getElementById('searchResults');
        if (searchTable) searchTable.style.display = "none";

}

// Button binding
document.querySelector("#btnBest").addEventListener('click', showBestAQICities, false);
