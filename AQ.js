// Global API Key
globalThis.api_key_two = "db9c36870967334b792cbdecc9527b5b4c834a90";

// ========== Show Best AQI Cities ==========

export async function showBestAQICities() {
    try {
        const url = `https://api.waqi.info/map/bounds/?token=${api_key_two}&latlng=8.4,68.7,37.6,97.25`; // India bounds
        const response = await fetch(url);
        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            throw new Error("No data found.");
        }

        // Filter and sort AQI data for best AQI cities
        const filtered = data.data
            .filter(station => station.aqi !== "-" && !isNaN(station.aqi))
            .filter(station => {
                const name = station.station.name.toLowerCase();
                return name.includes("india") || name.includes("delhi") || name.includes("mumbai") || name.includes("bangalore");
            });

        const sorted = filtered
            .sort((a, b) => a.aqi - b.aqi)
            .slice(0, 30); // Top 30 best AQI cities

        // Categorize AQI data
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

        // Hide other tables if present
        const searchTable = document.getElementById('searchResults');
        if (searchTable) searchTable.style.display = "none";

    } catch (error) {
        console.error("Error fetching best AQI cities:", error);
        alert("Failed to load best AQI cities. Please try again later.");
    }
}

// Button binding for Best AQI
document.querySelector("#btnBest").addEventListener('click', showBestAQICities, false);

// ========== Show Worst AQI Cities ==========

export async function showWorstAQICities() {
    try {
        const url = `https://api.waqi.info/map/bounds/?token=${api_key_two}&latlng=8.4,68.7,37.6,97.25`; // India bounds

        const response = await fetch(url);
        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            throw new Error("No data found.");
        }

        // Sort descending to get worst AQI
        const sorted = data.data
            .filter(station => station.aqi !== "-" && !isNaN(station.aqi))
            .sort((a, b) => b.aqi - a.aqi)
            .slice(0, 30); // Top 30 worst AQI cities

        const getCategorisedData = (aqi) => {
            if (aqi <= 50) return { impact: "Good", className: "good" };
            if (aqi <= 100) return { impact: "Moderate", className: "moderate" };
            if (aqi <= 150) return { impact: "Unhealthy for Sensitive Groups", className: "unhealthy-sensitive" };
            if (aqi <= 200) return { impact: "Unhealthy", className: "unhealthy" };
            if (aqi <= 300) return { impact: "Very Unhealthy", className: "very-unhealthy" };
            return { impact: "Hazardous", className: "hazardous" };
        };

        let html = `<h4 class="mb-3">Top 30 Worst AQI Cities in India</h4>`;
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

        // Hide other tables if present
        const searchTable = document.getElementById('searchResults');
        if (searchTable) searchTable.style.display = "none";

    } catch (error) {
        console.error("Error fetching worst AQI cities:", error);
        alert("Failed to load worst AQI cities. Please try again later.");
    }
}

// Button binding for Worst AQI
document.querySelector("#btnWorst").addEventListener('click', showWorstAQICities, false);
