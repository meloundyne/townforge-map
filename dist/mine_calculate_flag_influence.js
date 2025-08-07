
//<script src="calculate_flag_influence.js"></script>
let Selection_x0 = 0
let Selection_y0 = 0
let Selection_x1 = 0 
let Selection_y1 = 0
let Selection_city = 0
var marker_first = L.marker()
var marker_second = L.marker()
var rectangle_from_markers

function function_get_selection_influence () {
	let Selection_is_empty = 'yes'
	let Influence_from_role = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	let Influence_from_role_percent = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	let influencing = 0
	Selection_x0 = Math.min(marker_first.getLatLng().lng, marker_second.getLatLng().lng)// Longitude
	Selection_y0 = Math.min(marker_first.getLatLng().lat, marker_second.getLatLng().lat)// Latitude
	Selection_x1 = Math.max(marker_first.getLatLng().lng, marker_second.getLatLng().lng) // Longitude
	Selection_y1 = Math.max(marker_first.getLatLng().lat, marker_second.getLatLng().lat)// Latitude
	console.log(Selection_x0)
	console.log(Selection_y0)
	console.log(Selection_x1)
	console.log(Selection_y1)
	const temp1 = marker_first.getLatLng()
	const temp2 = marker_second.getLatLng()
	featureGroup_Legend.clearLayers();
	marker_first = L.marker(temp1, {draggable: true}).addTo(featureGroup_Legend);
	marker_second = L.marker(temp2, {draggable: true}).addTo(featureGroup_Legend);
	rectangle_from_markers = L.rectangle([xy([Selection_x0, Selection_y0]),xy([Selection_x1, Selection_y1])], {color: 'Blue',fillColor: 'Pink', weight: 3, fillOpacity: 0.9, interactive: false}).addTo(featureGroup_Legend);
	var run = L.geoJson(allFlagsCities, {
		onEachFeature: function(feature, layer){
			let uz_je_tam_flag = 0
			let Selection_Flag_pres_sebe_msq = 0
			let OtherFlag_x0 = feature.geometry.coordinates[0][0][0]
			let OtherFlag_y0 = feature.geometry.coordinates[0][0][1]
			let OtherFlag_x1 = feature.geometry.coordinates[0][2][0]
			let OtherFlag_y1 = feature.geometry.coordinates[0][2][1]
			if ( Selection_city == feature.properties.city ) {
				let Dx0
				let Dy0
				let Dx1
				let Dy1
				if (Math.max(Selection_x0, OtherFlag_x0) < Selection_x1) { Dx0 = Math.max(Selection_x0, OtherFlag_x0); uz_je_tam_flag += 1 }
				if (Math.max(Selection_y0, OtherFlag_y0) < Selection_y1) { Dy0 = Math.max(Selection_y0, OtherFlag_y0); uz_je_tam_flag += 1 }
				if (Math.min(Selection_x1, OtherFlag_x1) > Selection_x0) { Dx1 = Math.min(Selection_x1, OtherFlag_x1); uz_je_tam_flag += 1 }
				if (Math.min(Selection_y1, OtherFlag_y1) > Selection_y0) { Dy1 = Math.min(Selection_y1, OtherFlag_y1); uz_je_tam_flag += 1 }
				if ( uz_je_tam_flag == 4 ) {
					Selection_Flag_pres_sebe_msq = (Dx1 - Dx0) * (Dy1 - Dy0)
					Selection_is_empty = 'no'
					console.log(`Selection_Flag_pres_sebe_msq: ${Selection_Flag_pres_sebe_msq}`)
					console.log(`Selection_is_empty: ${Selection_is_empty}`)
				}
			}
			//console.log(`Selection_Flag_pres_sebe_msq: ${Selection_Flag_pres_sebe_msq}`)
			//console.log(`Selection_is_empty: ${Selection_is_empty}`)
			
			let influence_pres_selection = 0
			if ( Selection_city == feature.properties.city ) {
				//console.log('--------------------')
				//console.log(`Influence: ${feature.properties.influence}`)
				OtherFlag_x0 -= Number(feature.properties.influence)
				OtherFlag_y0 -= Number(feature.properties.influence)
				OtherFlag_x1 += Number(feature.properties.influence)
				OtherFlag_y1 += Number(feature.properties.influence)
				if (Math.max(Selection_x0, OtherFlag_x0) < Selection_x1) { Dx0 = Math.max(Selection_x0, OtherFlag_x0); influence_pres_selection += 1 }
				if (Math.max(Selection_y0, OtherFlag_y0) < Selection_y1) { Dy0 = Math.max(Selection_y0, OtherFlag_y0); influence_pres_selection += 1 }
				if (Math.min(Selection_x1, OtherFlag_x1) > Selection_x0) { Dx1 = Math.min(Selection_x1, OtherFlag_x1); influence_pres_selection += 1 }
				if (Math.min(Selection_y1, OtherFlag_y1) > Selection_y0) { Dy1 = Math.min(Selection_y1, OtherFlag_y1); influence_pres_selection += 1 }
				
				const Selection_msq = (Selection_x1 - Selection_x0) * (Selection_y1 - Selection_y0)
				const Influence_msq = (OtherFlag_x1 - OtherFlag_x0)*(OtherFlag_y1 - OtherFlag_y0)
        	
				//console.log(influence_pres_selection)
				let Dsqm
				if ( influence_pres_selection == 4 ){
				Dsqm = (Dx1 - Dx0) * (Dy1 - Dy0)
				}
				let showlog = 0
				if ( Dsqm > 0 ) { //overlap
				influencing += 1
				Influence_from_role[feature.properties.role] += 1
				Influence_from_role_percent[feature.properties.role] += ( Dsqm / Selection_msq * 100 ) // influence in percent
				showlog = 1
				}
        	
				if ( showlog == 1 ) {
					console.log(`Selection: ${Selection_msq} msq`)
					console.log(`Influence: ${Influence_msq} msq`)
					console.log(`Selection under influence: ${Dsqm}`)
					console.log(`Flags influencing selection: ${influencing}`)	
				}
			
			}
		}
	})




	let text001 = (Selection_x1 - Selection_x0)
	let text002 = (Selection_y1 - Selection_y0)
	let text = `${text001} x ${text002}`
	let WARNING = ""
	if (text001 > 256 && text002 < 256){
		WARNING = "<h1 style='color:red'>Selected x is larger than 256</h1>"
	}
	if (text001 < 256 && text002 > 256){
		WARNING = "<h1 style='color:red'>Selected y is larger than 256</h1>"
	}
	if (text001 > 256 && text002 > 256){
		WARNING = "<h1 style='color:red'>Selected x and y is larger than 256</h1>"
	}
	let WARNING2 = ""
	if (Selection_is_empty == 'no'){
		WARNING2 = "<h1 style='color:red'>Flag is already there</h1>"
	}
	text1=`
<table class='popup_table'><thead>${WARNING}${WARNING2}</thead><tbody>
<tr><td>Selection</td><td>${text}</td></tr>
<tr><td colspan="2"><b>Influence from role</b></td></tr>
<tr><td>${FLAG_ROLE_NAME[1]}</td><td>${Math.trunc((Math.trunc(Influence_from_role_percent[1])+50)/100)}</td></tr>
<tr><td>${FLAG_ROLE_NAME[2]}</td><td>${Math.trunc((Math.trunc(Influence_from_role_percent[2])+50)/100)}</td></tr>
<tr><td>${FLAG_ROLE_NAME[3]}</td><td>${Math.trunc((Math.trunc(Influence_from_role_percent[3])+50)/100)}</td></tr>
<tr><td>${FLAG_ROLE_NAME[4]}</td><td>${Math.trunc((Math.trunc(Influence_from_role_percent[4])+50)/100)}</td></tr>
<tr><td>${FLAG_ROLE_NAME[5]}</td><td>${Math.trunc((Math.trunc(Influence_from_role_percent[5])+50)/100)}</td></tr>
<tr><td>${FLAG_ROLE_NAME[6]}</td><td>${Math.trunc((Math.trunc(Influence_from_role_percent[6])+50)/100)}</td></tr>
<tr><td>${FLAG_ROLE_NAME[7]}</td><td>${Math.trunc((Math.trunc(Influence_from_role_percent[7])+50)/100)}</td></tr>
<tr><td>${FLAG_ROLE_NAME[8]}</td><td>${Math.trunc((Math.trunc(Influence_from_role_percent[8])+50)/100)}</td></tr>
<tr><td>${FLAG_ROLE_NAME[9]}</td><td>${Math.trunc((Math.trunc(Influence_from_role_percent[9])+50)/100)}</td></tr>
<tr><td>${FLAG_ROLE_NAME[10]}</td><td>${Math.trunc((Math.trunc(Influence_from_role_percent[10])+50)/100)}</td></tr>
<tr><td>${FLAG_ROLE_NAME[11]}</td><td>${Math.trunc((Math.trunc(Influence_from_role_percent[11])+50)/100)}</td></tr>
<tr><td>${FLAG_ROLE_NAME[12]}</td><td>${Math.trunc((Math.trunc(Influence_from_role_percent[12])+50)/100)}</td></tr>
<tr><td>${FLAG_ROLE_NAME[13]}</td><td>${Math.trunc((Math.trunc(Influence_from_role_percent[13])+50)/100)}</td></tr>
<tr><td>${FLAG_ROLE_NAME[14]}</td><td>${Math.trunc((Math.trunc(Influence_from_role_percent[14])+50)/100)}</td></tr>
<tr><td>${FLAG_ROLE_NAME[15]}</td><td>${Math.trunc((Math.trunc(Influence_from_role_percent[15])+50)/100)}</td></tr>
<tr><td>${FLAG_ROLE_NAME[16]}</td><td>${Math.trunc((Math.trunc(Influence_from_role_percent[16])+50)/100)}</td></tr>
<tr><td>${FLAG_ROLE_NAME[17]}</td><td>${Math.trunc((Math.trunc(Influence_from_role_percent[17])+50)/100)}</td></tr>
<tr><td colspan="3"><a target="_blank" href="https://townforge.net/manual/">townforge.net/manual/</a>  Influence</td></tr>
</tbody>
</table>
`;
	var popup = L.popup({maxWidth: 1000, className: 'popup_without_tip', autoClose: true, closeOnClick: false})
            .setLatLng(xy([Selection_x1, (Selection_y1 + 60)]))
            .setContent(text1)
            .openOn(featureGroup_Legend);
}
