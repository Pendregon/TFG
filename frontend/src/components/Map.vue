<template>
    <l-map
        ref="map"
        :class="['map',zoomControl ? '':'hide_zoom_control']" 
        :zoom="zoom" 
        :center="center" 
        @focus="$emit('mapFocused')"
        @blur="$emit('mapUnfocused')"
        @update:zoom="zoomUpdated" 
        @update:center="centerUpdated" 
        @update:bounds="boundsUpdated" 
    >
        <l-tile-layer :url="url"></l-tile-layer>
        <template
            v-for="mission in missions"
        >   
            <template
                v-for="vehicle in mission.vehicles"
            > 
                <div :key="vehicle.id" >
                    <v-rotated-marker 
                        v-if="vehicle.records && vehicle.records.length > 0"
                        :lat-lng="[vehicle.records[vehicle.current_playing_record].latitude, vehicle.records[vehicle.current_playing_record].longitude]" 
                        @click="$emit('showInfo', vehicle)" 
                    >
                        <l-icon 
                            :class-name="`boat-${vehicle.name}-${mission.name}-icon`" 
                            :icon-size="dynamicSize" 
                            :icon-anchor="dynamicAnchor" 
                        >
                            <svg :style="{transform: `rotate(${vehicle.records[vehicle.current_playing_record].heading}deg)`}" viewBox="0 0 16.46 55.55">
                                <path :style="{fill: vehicle.boat_mark_color == '' ? '#002885' : vehicle.boat_mark_color, stroke:'#1d1d1b'}" class="boat_marker" d="M15.46,45.26c0-23.93-3-38.2-5.86-42.78C8.31.39,8.19.6,6.9,2.55,4,6.88,1,20.91,1,45.26,1.21,57.39,15.46,57.9,15.46,45.26Z"/>
                            </svg>
                            <svg v-if="show_wind" :style="{transform: `translate(-50%, -85%) rotate(${vehicle.records[vehicle.current_playing_record].true_wind_angle}deg)`}" class="wind_svg" viewBox="0 0 12.79 27.15">
                                <path
                                    v-for="index in Math.floor(vehicle.records[vehicle.current_playing_record].true_wind_speed / 50)"
                                    :key="index"
                                    class="wind_svg_velocity_triangle" 
                                    d="M27.47,1.13c.16.17-11.8,8.65-11.8,8.65V6.61S27.3,1,27.47,1.13Z" 
                                    :transform="`translate(-15.17 ${index * 4 - 4})`"
                                />
                                <line 
                                    v-for="index in Math.floor(vehicle.records[vehicle.current_playing_record].true_wind_speed % 50 / 10)"
                                    :key="index"
                                    class="wind_svg_velocity_long_line" 
                                    x1="0.26" 
                                    y1="6.61" 
                                    x2="12.18" 
                                    y2="0.66"
                                    :transform="`translate(0 ${index * 2 - 2 + Math.floor(vehicle.records[vehicle.current_playing_record].true_wind_speed / 50) * 4.3})`"
                                />
                                <line 
                                    v-for="index in Math.ceil(vehicle.records[vehicle.current_playing_record].true_wind_speed % 50 % 10 / 5)"
                                    :key="index"
                                    class="wind_svg_velocity_short_line" 
                                    x1="0.26" 
                                    y1="6.61" 
                                    x2="6.33" 
                                    y2="3.58"
                                    :transform="`translate(0 ${index * 2 - 2 + Math.floor(vehicle.records[vehicle.current_playing_record].true_wind_speed / 50) * 4.3 + Math.floor(vehicle.records[vehicle.current_playing_record].true_wind_speed % 50 / 10) * 2})`"
                                />
                                <path class="wind_svg_angle_line" :style="{fill: '#fff', stroke:'#1d1d1b'}" d="M16.17,6.81v21" transform="translate(-15.17 -0.63)"/>
                            </svg>
                        </l-icon>
                        
                    </v-rotated-marker>
                </div>
                
            </template>
        </template>

        <template v-if="show_boats_route">
            <template
                v-for="mission in missions"
            >   
                <template
                    v-for="vehicle in mission.vehicles"
                > 
                    <l-polyline 
                        v-if="vehicle.records && vehicle.records.length > 0"
                        :key="`1-${mission.id}-${vehicle.id}`" 
                        :lat-lngs="vehicle.latLngs" 
                        :color="vehicle.boat_mark_color == '' ? '#002885' : vehicle.boat_mark_color"
                    ></l-polyline>
                </template>
            </template>
        </template>
        <template v-if="show_waypoints">
            <template
                v-for="mission in missions"
            >  
                <template
                    v-for="vehicle in mission.vehicles"
                >  
                    <div
                        v-if="vehicle.records && vehicle.records.length > 0"
                        :key="`5-${mission.id}-${vehicle.id}`" 
                    >
                        <l-marker 
                            v-for="waypoint in vehicle.waypoints" 
                            :key="`4-${mission.id}-${vehicle.id}-${waypoint.id}`" 
                            :lat-lng="[waypoint.latitude, waypoint.longitude]"
                        >
                            <l-icon>
                                <svg class='waypoint_svg' viewBox="0 0 25.47 39.41">
                                    <path :style="{fill: vehicle.boat_waypoint_color == '' ? '#002885' : vehicle.boat_waypoint_color, stroke:'#1d1d1b'}" class="waypoint_marker" d="M12.33.5S.5.4.5,12,12.33,38.62,12.33,38.62,25,24,25,12.33,12.33.5,12.33.5Zm.41,14.06a5,5,0,1,1,5-5A5,5,0,0,1,12.74,14.56Z"/>
                                </svg>
                            </l-icon>
                        </l-marker>
                        <l-polyline 
                            :lat-lngs="vehicle.waypoints_latLngs" 
                            :color="vehicle.boat_waypoint_color == '' ? '#002885' : vehicle.boat_waypoint_color"
                        ></l-polyline>
                    </div>
                </template>
            </template>
        </template>
        <template v-if="show_next_waypoint">
            <template
                v-for="mission in missions"
            >  
                <template
                    v-for="vehicle in mission.vehicles" 
                >  
                    <div
                        v-if="vehicle.records && vehicle.records.length > 0"
                        :key="`2-${mission.id}-${vehicle.id}`" 
                    >
                        <l-marker 
                            :lat-lng="[vehicle.records[vehicle.current_playing_record].active_wp_latitude, vehicle.records[vehicle.current_playing_record].active_wp_longitude]"
                        >
                            <l-icon>
                                <svg class='waypoint_svg' viewBox="0 0 25.47 39.41">
                                    <path :style="{fill: '#002885' , stroke:'#1d1d1b'}" class="waypoint_marker" d="M12.33.5S.5.4.5,12,12.33,38.62,12.33,38.62,25,24,25,12.33,12.33.5,12.33.5Zm.41,14.06a5,5,0,1,1,5-5A5,5,0,0,1,12.74,14.56Z"/>
                                </svg>
                            </l-icon>
                        </l-marker>
                        <l-polyline 
                            :lat-lngs="[[vehicle.records[vehicle.current_playing_record].active_wp_latitude, vehicle.records[vehicle.current_playing_record].active_wp_longitude], [vehicle.records[vehicle.current_playing_record].latitude, vehicle.records[vehicle.current_playing_record].longitude]]" 
                            :color="'#002885'"
                        ></l-polyline>
                    </div>
                </template>
            </template>
        </template>
    </l-map>
</template>

<style lang="stylus">
    .hide_zoom_control .leaflet-control-zoom
        visibility hidden

    .boat_marker
        stroke-miterlimit 10

    .waypoint_marker
        stroke-miterlimit 10

    .waypoint_svg
        transform translate(-30%, -80%)
        height 35px
        width 35px

    .wind_marker
        stroke-miterlimit 10
        stroke-width 2px

    .wind_svg
        height 35px
        width 35px
        position absolute
        transform-origin 50% 185%
        top 0
        left 50%

        .wind_svg_velocity_triangle
            stroke black
            fill black

        .wind_svg_velocity_long_line
            stroke black
            fill black

        .wind_svg_velocity_short_line
            stroke black
            fill black
</style>

<script>
	import {LMap, LTileLayer, LIcon, LPolyline, LMarker} from 'vue2-leaflet';
    import Vue2LeafletRotatedMarker from 'vue2-leaflet-rotatedmarker'

	export default {
		name: 'Map',
		components: {
			LMap,
			LTileLayer,
            LIcon, 
            LPolyline,
            LMarker,
            'v-rotated-marker': Vue2LeafletRotatedMarker
		},
        props: ['missions', 'show_boats_route', 'show_next_waypoint', 'show_waypoints', 'show_wind', 'zoomControl'],
		data () {
			return {
				url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
				zoom: 13,
				center: [28.143732, -15.456884],
				bounds: null,
                iconSize: 20
			};
		},
		beforeMount() {
			setInterval(() =>{
				this.$forceUpdate()
			}, 1000)
		},
		methods: {
			zoomUpdated (zoom) {
				this.zoom = zoom;
                // console.log(`New zoom: ${zoom}`)
			},
			centerUpdated (center) {
				this.center = center;
                // console.log(`New center: ${center}`)
			},
			boundsUpdated (bounds) {
				this.bounds = bounds;
                // console.log(`New bounds: ${bounds}`)
			},
		},
        computed: {
            dynamicSize () {
                return [this.iconSize, this.iconSize * 2.82];
            },
            dynamicAnchor () {
                return [this.iconSize / 2, this.iconSize * 1.5];
            }
        },
	}
</script>