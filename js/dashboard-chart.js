import {app, firebaseConfig, auth, db, getUserName, signOutUser, setData, updateData, getData} from './lib.js';
import {updateNavbar} from './main.js';

// Code for generating a Chart.js line chart for flight prices
async function getFlightData() {
    const user = getUserName();
    const userID = user.uid; // Get user name and uid
    
    const xDates = [];         // x-axis label = flight dates  
    const yPrices = [];        // y-axis label = flight prices
    const sorting_var = [];    // This is for sorting dates
    let totalPrice = 0;        // Total of all flight prices for loyalty stat

    const bookings = await getData(db, `users/${userID}/bookings`);                
    
    for (let path in bookings) {
        let bookingTime = bookings[path]; // The value of each key in the dict is the flight time
        let decodedPath = decodeURIComponent(path); // The key itself is a path which has to be decoded using decodeURIComponent() function

        let flightData = await getData(db, decodedPath);  // Fetch details of each flight using the decoded path
        if (flightData) {
            let flightDate = decodedPath.split("/")[3] + "/" + 
                             decodedPath.split("/")[4] + "/" +
                             decodedPath.split("/")[2]; // Get the flight date from the path by splitting it using the "/" character and concatenating the third, fourth, and fifth values    
            // Get flight date
            ////xDates.push(flightDate);                     // Push each date into array for dates
            
            const price = parseFloat(flightData.price);   // Conversions
            const date_obj = new Date(`${decodedPath.split("/")[2]}-${decodedPath.split("/")[3]}-${decodedPath.split("/")[4]}`); // Convert to obj so it can be sorted
            sorting_var.push({date_obj, flightDate, price}); // Push into array
            totalPrice += price; // Accumulate sum for loyalty stat
            console.log(flightDate, price); // FOR DEBUG, PRINTS TO CONSOLE, DELETE LATER
        }
    }
    sorting_var.sort((first, second) => first.date_obj - second.date_obj); // Sort dates
    for (const date of sorting_var) { // Push each date into array for dates
        xDates.push(date.flightDate);
        yPrices.push(date.price);
    }
    return {xDates, yPrices, totalPrice};  // Return dates and prices of the flights for chart
}

async function createFlightChart() {
    const data = await getFlightData(); // creatFlightChart will wait for getFlightData to process flight data

    /////// Loyalty saving logic:
    const user = getUserName();
    const userID = user.uid;
    // Check loyalty status before setting saving amount
    const loyalty_active = await getData(db, `users/${userID}/accountInfo/active-loyalty-member`);

    let saved = 0;

    if (loyalty_active === true) {
        saved = data.totalPrice * 0.01;   // 1% savings for loyalty plan
    }
    const amount_saved = document.getElementById("amount-saved");
    if (amount_saved) {
        amount_saved.textContent = `$${saved.toFixed(2)}`; // Return formatted price
    } // toFixed(2) - rounds to 2 decimal places

    // Check if we have data
    if (data.xDates.length === 0) {
        console.log("No flight data available for chart");
        return;
    }

    const flightChart = document.getElementById("flight-chart");

    if (!(flightChart instanceof HTMLCanvasElement)) {
    console.error("flight-chart canvas not found", flightChart);
    return;
    }

    const new_flight_chart = flightChart.getContext("2d");

    const myChart = new Chart(new_flight_chart, {  // Construct the chart    
        type: 'line',                        // Line chart for time series
        data: {                         // Define data
            labels: data.xDates,       // x-axis labels
            datasets: [                 // Each object describes one dataset of y-values
                                        //  including display properties.  To add more datasets, 
                                        //  place a comma after the closing curly brace of the last
                                        //  data set object and add another dataset object. 
                {
                    label:    `Price`,   
                    data:     data.yPrices,    // Reference to array of y-values
                    backgroundColor:  '#292524',    // Color for data area
                    borderColor:      '#edc351',      // Color for line
                    borderWidth:      2,   // Line width
                    fill: false,           // Fill area under line
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Flight Date',
                        font: {
                        size: 20,
                        weight: 'bold'
                        },
                        color: '#edc351'
                    },
                    ticks: {
                        font: {
                        size: 12
                        },
                        color: 'rgba(237, 195, 81, 0.5)'
                    },
                    grid: {
                        color: 'rgba(237, 195, 81, 0.3)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price ($)',
                        font: {
                        size: 20,
                        weight: 'bold'
                        },
                        color: '#edc351'
                    },
                    ticks: {
                        font: {
                        size: 12
                        },
                        callback: function(value) {
                            return '$' + value; // $ in front for y axis
                        },
                        color: 'rgba(237, 195, 81, 0.5)'
                    },
                    grid: {
                        color: 'rgba(237, 195, 81, 0.3)'
                    }
                }
            },
            plugins: {                  // Display options for title and legend
                title: {
                    display: true,
                    text: 'Booking Prices Over Time',
                    font: {
                        size: 24,
                    },
                    color: '#edc351',
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                legend: {
                    //display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            family: 'Arial, sans-serif'
                        },
                        color: '#edc351' 
                    }
                }
            }
        }      
    });
}

// call the main function
createFlightChart();