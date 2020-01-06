// Fill in the drop down menus
function drop_down_update() {
  // Read in the data and make promise
  d3.json("/data_one").then((data) => {
    
      // grab drop downs
      var drop_down_1 = d3.select("#first_selection")
      var drop_down_2 = d3.select("#second_selection")
      var drop_down_3 = d3.select("#third_selection")
      
      // Grab specific attributes to go in dropdowns
      var keys = Object.entries(data)
      var first_key = keys[0]
      var attributes = Object.keys(first_key[1])
      var attributes = attributes.splice(1)
      attributes.pop()
      attributes.pop()
      attributes.pop()
      attributes.pop()
      var index = attributes.indexOf('Country')
      if (index > -1) {
        attributes.splice(index,1)
      }
      attributes.unshift("No Selection")

      // Append attributes to dropdowns
      attributes.forEach((attribute) => {
        drop_down_1.append("option").text(attribute).property("value", attribute)
        drop_down_2.append("option").text(attribute).property("value", attribute)
        drop_down_3.append("option").text(attribute).property("value", attribute)
      })
  })

  d3.json("/data_two").then((data) => {

    // Grab the dropdown
    var country_drop_1 = d3.select("#country_selection_1")
    var country_selection = d3.select("#country_input")
    var country_drop_2 = d3.select("#country_selection_2")

    var keys = Object.entries(data)
    keys.unshift(["No Selection"])
    keys.forEach((key) => {
      country_drop_1.append("option").text(key[0]).property("value", key[0])
      country_selection.append("option").text(key[0]).property("value", key[0])
      country_drop_2.append("option").text(key[0]).property("value", key[0])
    })
  })
}

function grab_params_and_filter() {

  d3.json("/data_one").then((data) => {
    
    keys = Object.entries(data)

    var filtered_list = []
    keys.forEach((datum, index) => {

      var param_1 = d3.select("#first_selection").node().value
      var param_2 = d3.select("#second_selection").node().value
      var param_3 = d3.select("#third_selection").node().value
      var min_acreage_box = d3.select("#min_acreage_input").node().value
      var min_distance_box = d3.select("#min_distance_input").node().value
      var max_acreage_box = d3.select("#max_acreage_input").node().value
      var max_distance_box = d3.select("#max_distance_input").node().value
      var country_input = d3.select("#country_input").node().value
      
      var island_info = datum[1]
      var param_1_yes_no = island_info[param_1]
      var param_2_yes_no = island_info[param_2]
      var param_3_yes_no = island_info[param_3]
      var acreage = island_info["Acreage"]
      var distance = island_info["city_distance"]
      var country = island_info["Country"]

      if (min_acreage_box === "") {
          var min_acreage_box = 0
      }

      if (min_distance_box === "") {
          var min_distance_box = 0
      }

      if (max_acreage_box === "") {
          var max_acreage_box = 1000000
      }

      if (max_distance_box === "") {
          var max_distance_box = 1000000
      }

      if (country_input == "No Selection") {
        var country_input = country
      }

      if (country_input == country && param_1_yes_no !== "no" && param_2_yes_no !== "no" && param_3_yes_no !== "no" && acreage >= min_acreage_box && distance >= min_distance_box && distance <= max_distance_box && acreage <= max_acreage_box) {
          filtered_list.push(datum)
      }

    })
    make_scatter(filtered_list)
  })
}

function make_scatter(data) {
  
  distances = []
  acreages = []
  names = []

  data.forEach((island) => {
    var island_name = island[0]
    var island_info = island[1]
    
    var country = island_info["Country"]
    var distance = island_info["city_distance"]
    var acreage = island_info["Acreage"]

    var my_string = island_name.concat(": ", country)
    
    distances.push(distance)
    acreages.push(acreage)
    names.push(my_string)

      
  })
  
  var trace1 = {
    x: distances,
    y: acreages,
    mode: 'markers',
    marker: {size:6},
    text: names,
    type: 'scatter'
  }

  var layout = {
      title: {
        text:'Remoteness vs Island Size',
        font: {
          family: 'Courier New, monospace',
          size: 24
        },
        xref: 'paper',
        x: 0.05,
      },
      xaxis: {
        title: {
          text: 'Distance to Nearest City in Miles',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
      },
      yaxis: {
        title: {
          text: 'Island Acreage',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      }
    };

  var cool = [trace1]

  Plotly.newPlot("scatter", cool, layout)
}

function make_bar() {
  d3.json("/data_two").then((data) => {
      
    var keys = Object.entries(data)
    var countrys = []
    var homicides = []
    var corruptions = []

    keys.forEach((item) => {
      var country = item[0]
      var stats = item[1]
      var country_selection_1 = d3.select("#country_selection_1").node().value
      var country_selection_2 = d3.select("#country_selection_2").node().value

      if (country_selection_1 == "No Selection" && country_selection_2 == "No Selection") {
        countrys.push(country)
        homicides.push(stats["Homicide Rate"])
        corruptions.push(stats["CPI Score 2018"])
        

      } else {
        if (country_selection_1 == country || country_selection_2 == country) {
          countrys.push(country)
          homicides.push(stats["Homicide Rate"])
          corruptions.push(stats["CPI Score 2018"])
        }
      }
    })
    
    var trace1 = {
      x: countrys,
      y: homicides,
      name: "Homicide Rates",
      type: "bar"
    }

    var trace2 = {
      x: countrys,
      y: corruptions,
      name: "Corruption Score",
      type: 'bar'
    }

    var data = [trace1, trace2]
    var layout = {barmode: 'group', xaxis: {tickangle: 35, showticklabels: true, type: 'category'}}
    Plotly.newPlot('bar', data, layout)
  })
}

console.log("hi")

drop_down_update()
grab_params_and_filter()
make_bar()

d3.select("#submit").on("click", grab_params_and_filter)
d3.select("#country_selection_1").on("change", make_bar)
d3.select("#country_selection_2").on("change", make_bar)