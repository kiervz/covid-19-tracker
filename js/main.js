$(document).ready(function() {
    $.getJSON("https://corona.lmao.ninja/v2/all", function(data) {
        let total_cases = data.cases;
        let total_affected_countries = data.affectedCountries;
        let total_recoveries = data.recovered;
        let total_deaths = data.deaths;
        
        console.log(data);

        $("#total_affected").append(total_affected_countries);
        $("#total_cases").append(total_cases);
        $("#total_recoveries").append(total_recoveries);
        $("#total_deaths").append(total_deaths);   
    });

    $.getJSON("https://corona.lmao.ninja/v2/countries", function(data) {
        let countries = [];
        let cases = [];
        let recovered = [];
        let deaths = [];

        $.each(data, function(id, obj) {
            countries.push(obj.country);
            cases.push(obj.cases);
            recovered.push(obj.recovered);
            deaths.push(obj.deaths);
        });

        var xAxisLabelMinWidth = 15; // Replace this with whatever value you like
        var myChart = new Chart(document.getElementById('myChart').getContext('2d'), {
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

        function fitChart(){
            var chartCanvas = document.getElementById('myChart');
            var maxWidth = chartCanvas.parentElement.parentElement.clientWidth;
            var width = Math.max(mayChart.data.labels.length * xAxisLabelMinWidth, maxWidth);

            chartCanvas.parentElement.style.width = width +'px';
        }

        let data_html_template = "";

        for (let item of data) {
            data_html_template += document.getElementById("result").innerHTML = ` 
                <div class="col-lg-3 col col-md-3 col-sm-12 col-xs-12">
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
        }
        
        return document.getElementById("result").innerHTML = data_html_template;
    });
});