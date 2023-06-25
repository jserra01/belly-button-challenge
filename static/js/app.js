//Get data endpoint
const url = ("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json");

//Fetch json data: add Test Subjects to drop down list
d3.json(url).then(function(ids) {
    const testIDs = ids.names;
    //console.log("ID Length: ", testIDs.length);
    testIDs.sort((a, b) => a - b);
    //console.log("IDs", testIDs);

    //select dropdown menu
    const select = document.getElementById("selDataset");

    //Add the dropdown options
    for (let i = 0; i<testIDs.length; i++) {
        let option = document.createElement("option");
        option.text = testIDs[i];
        option.value = testIDs[i];
        //console.log(option)
        select.appendChild(option);
    }

})

//Startup plots
function init() {
    getData("940");
}

// On change to the DOM , call getData()
d3.selectAll("#selDataset").on("change", function() {
    let subjectSelected = d3.select("#selDataset");
    let subject = subjectSelected.property("value")
    getData(subject)
});

function getData(subject) {

    //Fetch json data
    d3.json(url).then(function(data) {
        filteredData = data.samples.filter(function(d) {
            return d.id === subject;
        });
    
        filteredMetaData = data.metadata.filter(function(d1) {
            return d1.id === parseInt(subject);
        })

        //console.log(data);
        //console.log(filteredData);
        //console.log(filteredMetaData);

        //Create horizontal bar chart
        sampleValues = filteredData[0].sample_values.slice(0, 10).reverse();
        labels = filteredData[0].otu_ids.slice(0, 10).reverse();
        otuDesc = filteredData[0].otu_labels.slice(0,10).reverse();

        let otuLabels = [];

        for (let i = 0; i < labels.length; i++) {
            otuLabels.push("OTU " + labels[i]);
        }

        /*//DATA CHECKS
        console.log("values", sampleValues);
        console.log("lables-int", labels);
        console.log("labels-text", otuLabels);
        console.log("desc", otuDesc);
        */

        //Trace data for bar chart
        let trace = {
            x: sampleValues,
            y: otuLabels,
            text: otuDesc,
            type: "bar",
            orientation: "h"
        };

        //Assign data for bar chart
        let plotData = [trace];

        //Apply layout to bar chart
        let layout = {
            height: 600,
            width: 450
        };

        //Render the bar chart
        Plotly.newPlot("bar", plotData, layout, {displayModeBar: false});

        //Create a bubble chart
        bubbleLabels = filteredData[0].otu_ids;
        bubbleColors = filteredData[0].otu_ids;
        bubbleValues = filteredData[0].sample_values.reverse();
        bubbleMarkerSize = filteredData[0].sample_values.reverse();
        bubbleText = filteredData[0].otu_labels;

        /* DATA CHEKCS
        console.log("y", bubbleValues);
        console.log("x", bubbleLabels);
        console.log("text", bubbleText);
        console.log("size", bubbleMarkerSize);    
        */

        //Trace data
        let trace1 = {
            x: bubbleLabels,
            y: bubbleValues,
            text: bubbleText,
            mode: "markers",
            marker: {
                size: bubbleMarkerSize,
                sizemode: "diameter",
                sizeref: 1.5,
                color: bubbleColors,
                colorscale: "Earth"
            }
        };

        //Assign data for bubble chart
        let plotData1 = [trace1];

        //Apply layout to bubble chart
        let layout1 = {
            showlegend: false,
            xaxis: {
                title: "OTU ID"
            }
        }

        //Render bubble chart
        Plotly.newPlot("bubble", plotData1, layout1)

        //Capture metadata
        sampleID = filteredMetaData[0].id;
        sampleEthnicity = filteredMetaData[0].ethnicity;
        sampleGender = filteredMetaData[0].gender;
        sampleAge = filteredMetaData[0].age;
        sampleLocation = filteredMetaData[0].location;
        sampleBbtype = filteredMetaData[0].bbtype;
        sampleWfreq = filteredMetaData[0].wfreq

        /* DATA CHECKS
        console.log("ID: ", sampleID);
        console.log("Ethnicity: ", sampleEthnicity);
        console.log("Gender: ", sampleGender);
        console.log("Age: ", sampleAge);
        console.log("Location: ", sampleLocation);
        console.log("bbtype: ", sampleBbtype);
        console.log("wfreq: ", sampleWfreq);
        */
    
        d3.select("#sample-metadata").text("id: " + sampleID);
        d3.select("#sample-metadata").append("p").text("ethnicity: " + sampleEthnicity).style("margin", "0");
        d3.select("#sample-metadata").append("p").text("gender: " + sampleGender).style("margin", "0");
        d3.select("#sample-metadata").append("p").text("age: " + sampleAge).style("margin", "0");
        d3.select("#sample-metadata").append("p").text("location: " + sampleLocation).style("margin", "0");
        d3.select("#sample-metadata").append("p").text("bbtype: " + sampleBbtype).style("margin", "0");
        d3.select("#sample-metadata").append("p").text("wfreq: " + sampleWfreq).style("margin", "0");

    });

}

init();