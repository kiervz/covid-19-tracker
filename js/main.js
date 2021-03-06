$(document).ready(function() {
    

    $.getJSON("https://corona.lmao.ninja/v2/all", function(data) {
        let total_cases = data.cases;
        let total_affected_countries = data.affectedCountries;
        let total_recoveries = data.recovered;
        let total_deaths = data.deaths;

        $("#total_affected").append(total_affected_countries);
        $("#total_cases").append(total_cases);
        $("#total_recoveries").append(total_recoveries);
        $("#total_deaths").append(total_deaths);
        
    });

    $.getJSON("https://corona.lmao.ninja/v2/countries", function(data) {
        console.log(data)
        const mapbox_token = "pk.eyJ1Ijoia2llcnZzIiwiYSI6ImNrYzFkaXh5eDA5YXEycm9hc3Rvb3N0NXgifQ.Fu1NwruEXQDGGQEMn4KRsQ";

        mapboxgl.accessToken = mapbox_token;
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10',
            zoom: 1.5,
            center: [0, 20]
        });
        
        let countries = [];
        let cases = [];
        let recovered = [];
        let deaths = [];

        $.each(data, function(id, obj) {
            let lat = obj.countryInfo.lat;
            let long = obj.countryInfo.long;

            new mapboxgl.Marker({
                color: "red"
            }).setLngLat([long, lat]).addTo(map);

            countries.push(obj.country);
            cases.push(obj.cases);
            recovered.push(obj.recovered);
            deaths.push(obj.deaths);
        });

        let myChart = new Chart(document.getElementById('myChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: countries,
                datasets : [
                    {
                        label: "Cases",
                        data: cases, 
                        backgroundColor:"#f1c40f",
                    },
                    {
                        label: "Recovered",
                        data: recovered, 
                        backgroundColor:"#2ecc71",
                    },
                    {
                        label: "Deaths",
                        data: deaths, 
                        backgroundColor:"#e74c3c",
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
        
        showAllCountryInfo(data);

        //integrate to the select option all affected countries 
        for (let countries of data) {
            let x = document.getElementById("select-countries");
            let option = document.createElement("option");
            option.text = countries.country;
            x.add(option);
        }

        let selected_country;
        $("select").change(function () {    
            selected_country = document.getElementById("select-countries").value
            if (selected_country == "Select All Country") {
                showAllCountryInfo(data);
            } else {    
                showAllCountryInfo(data, selected_country);
            }
        });  

    });

    function showAllCountryInfo(data, filter = "Select All Country") {

        let data_html_template = "";
        
        for (let item of data) {
            let data_template = document.getElementById("result").innerHTML = ` 
                <div class="col-lg-3 col col-md-3 col-sm-12 col-xs-12" id="country-info">
                    <div class="card bg-light mb-3" style="max-width: 18rem;">
                        <div class="card-header bg-info text-white">${item.country} <img src="${item.countryInfo.flag}" style="width:30px;height:20px;"></div>
                        <div class="card-body">
                            <p class="card-text">Total Cases: ${item.cases}</p>
                            <p class="card-text">Today Cases: ${item.todayCases}</p>
                            <p class="card-text">Recovered: ${item.recovered}</p>
                            <p class="card-text">Deaths: ${item.deaths}</p>
                            <p class="card-text">Today Deaths: ${item.todayDeaths}</p>
                        </div>
                    </div>
                </div>
            `;
            
            if (filter != "Select All Country") {
                if (filter == item.country) {
                    data_html_template += data_template;
                }
            } else {
                data_html_template += data_template;
            }
        }
        
        return document.getElementById("result").innerHTML = data_html_template;
    }
});