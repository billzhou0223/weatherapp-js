var Weatherapp = {
    //last time when weather info updated
    lastUpdate: null,

    //time interval between two weather update point
    interval: 1000*60*10,

    //degree unit
    degree: 'fahrenheit',

    local: {
    	name:          'currentlocation',
    	latitude:      null,
    	longitude:     null,
    	weatherInfo:   {}
    },

    //city info
    city: [
    {
    	name:          'sanjose',
    	latitude:      37.3382082,
    	longitude:     -121.88632860000001,
    	weatherInfo:   {}
    },
    {
    	name:          'sydney',
    	latitude:      -33.8674869,
    	longitude:     151.20699020000006,
    	weatherInfo:   {}
    }
    ],

    //From Sunday to Saturday indexed by 0~6
    week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday', 'Saturday'],

    getLocalDate: function(time, offset) {
    	var date = new Date(time * 1000);
    	var utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes());
    	utc.setHours(utc.getHours() + offset);
    	return utc;
    },

    getLocalDay: function(city, i){
    	var day;
    	if(arguments.length === 1){
    		day = Weatherapp.getLocalDate(city.weatherInfo.currently.time, city.weatherInfo.offset).getDay();
    		return this.week[day];
    	}else{
    		day = Weatherapp.getLocalDate(city.weatherInfo.daily.data[i].time, city.weatherInfo.offset).getDay();
    		return this.week[day];
    	}
    },

    getLocalTime: function(date){ 
    	var time = date.getHours().toString() + ':' + date.getMinutes().toString() + ((date.getHours() <= 11)? ' AM': ' PM');
        return time;
    },

    windBearing: function(degree){
    	if(degree === 0) 
    		return 'N';
    	else if(degree > 0 && degree <90)
    		return 'NE';
    	else if(degree === 90)
    		return 'E';
    	else if(degree > 90 && degree < 180)
    		return 'SE';
    	else if(degree === 180)
    		return 'S';
    	else if(degree > 180 && degree <270)
    		return 'SW';
    	else if(degree === 270)
    		return 'W';
    	else if(degree > 270 && degree < 360)
    		return 'NW';
    },

    convertionFormula: function(li, unit){
        if(unit === 'fahrenheit'){
            li.map(function(i, e){
                var num = parseInt($(e).html());
                $(e).html((num * 2 + 30) + '˚');
            });
        }else{
            li.map(function(i, e){
                var num = parseInt($(e).html());
                $(e).html((Math.ceil((num - 30) / 2)) + '˚');
            });
        }
    },

    degreeUnitConvertion: function(city, unit){
        // if(page === 'list'){
            if(city === 'all'){
                var li = $('.cities-list > ul ul li:last-child');
                this.convertionFormula(li, unit);
            }else{
                var name = city.name,
                    selector = '.cities-list .is-' + name + ' li:last-child',
                    li = $(selector);

                this.convertionFormula(li, unit);
            }
            
        // }else{
            var liHeader = $('.city-header h1'),
            liOverview = $('.today-overview li:nth-child(n+3)'),
            liHourly = $('.today-hourly-list ul li:last-child'),
            liDaily = $('.forecast-list ul li:nth-child(n+3)');

            this.convertionFormula(liHeader, unit);
            this.convertionFormula(liOverview, unit);
            this.convertionFormula(liHourly, unit);
            this.convertionFormula(liDaily, unit);    
        // }
    },

    updateTime: function(){
    	if(this.local.weatherInfo.latitude){
    		var date = new Date(),
    		    time = this.getLocalTime(date);

    		$('.cities-list .is-currentlocation .time').html(time);
    	}

    	var sec = Date.parse(date) / 1000,
    	    name, offset, localDate;
    	for(var i = 0; i < this.city.length; ++i){
    		name = this.city[i].name;
    		offset = this.city[i].weatherInfo.offset;
    		// debugger;
    		localDate = this.getLocalDate(sec, offset);
    		time = this.getLocalTime(localDate);

            $('.cities-list .is-' + name + ' .time').html(time);
    	}
    },

    //add a city to citylist
    addCityList: function(city) {
    	if(city.weatherInfo.latitude){
    		var ul = $('.cities-list > ul'),
    		    name = city.name,
    		    date = this.getLocalDate(city.weatherInfo.currently.time, city.weatherInfo.offset),
    		    time = this.getLocalTime(date),
    		    temp = parseInt(city.weatherInfo.currently.temperature),
    		    li = $('<li class = "is-' + name + '">'),
    		    liHTML = [
                    '<a href="#city/', name, '">',
                       '<ul>',
                          '<li>',
                             '<div class="time">', time, '</div>',
                             '<div class="city-name">', name, '</div>',
                          '</li>',
                          '<li>', temp, '˚', '</li>',
                        '</ul>',
                    '</a>'
    		    ].join('');
            li.html(liHTML);
            ul.append(li);

            //change background
            var hour = date.getHours();
            li = $('.cities-list .is-' + name); 
            if(hour < 7 || hour > 18){
            	li.removeClass('day');
            	li.addClass('night');
            }else{
            	li.removeClass('night');
            	li.addClass('day');
    	    }
    	}

        // if(Weatherapp.degree === 'centigrade')
        //     this.degreeUnitConvertion('list', 'centigrade');
    },

    //update citylist
    updateCityList: function(city){
    	var selector = '.cities-list .is-' + city.name,
    	    name = city.name,
    	    date = this.getLocalDate(city.weatherInfo.currently.time, city.weatherInfo.offset),
    	    time = this.getLocalTime(date),
    	    temp = parseInt(city.weatherInfo.currently.temperature).toString() + '˚';

    	$(selector + ' .city-name').html(name);
    	$(selector + ' .time').html(time);
    	$(selector + ' li:last-child').html(temp);

    	//change background
    	var hour = date.getHours(),
    	    li = $('.cities-list .is-' + name); 
    	if(hour < 7 || hour > 18){
    		li.removeClass('day');
    		li.addClass('night');
    	}else{
    		li.removeClass('night');
    		li.addClass('day');
    	}

        if(Weatherapp.degree === 'centigrade')
            this.degreeUnitConvertion(city, 'centigrade');
    },

    //update the detial page
    updateDetail: function(city) {
    	//update header
    	var name =       city.name,
    	    summary =    city.weatherInfo.currently.summary,
    	    temp =       parseInt(city.weatherInfo.currently.temperature).toString() + '˚';

    	$('.city-header h2').html(name);
    	$('.city-header h4').html(summary);
    	$('.city-header h1').html(temp);

    //update today
    	//update today overview
    	var day = this.getLocalDay(city),
    	    tempMin = parseInt(city.weatherInfo.daily.data[0].temperatureMin).toString() + '˚',
    	    tempMax = parseInt(city.weatherInfo.daily.data[0].temperatureMax).toString() + '˚',
    	    li = $('.today-overview li');

    	    li[0].innerHTML = day;
    	    li[1].innerHTML = 'Yesterday';
    	    li[2].innerHTML = tempMax;
    	    li[3].innerHTML = tempMin;

    	//update today list
    	var ul = $('.today-hourly-list > li ul');
    	$.map(ul, function(n, i){
    		var time = Weatherapp.getLocalDate(city.weatherInfo.hourly.data[i].time, city.weatherInfo.offset).getHours(),
    		    icon = 'images/' + city.weatherInfo.hourly.data[i].icon + '.png',
    		    temp = parseInt(city.weatherInfo.hourly.data[i].temperature).toString() + '˚';

    		time += (time <= 11)? ' AM': ' PM';
    		if(i === 0){
    			time = 'Now';
    		}

    		// var li = $(n).find('li');
    		// li[0].innerHTML = time;
    		// $(li[1]).find('img').attr('src', icon);
    		// li[2].innerHTML = temp;

    		var ulHTML = [
                   '<li>', time, '</li>',
                   '<li>', '<img src = "', icon, '">',
                   '<li>', temp, '</li>'
    		].join('');
    		n.innerHTML = ulHTML;
    	});

    	//update forecast
    	ul = $('.forecast-list ul');
    	$.map(ul, function(n, i){
    		day = Weatherapp.getLocalDay(city, i);
    		icon = 'images/' + city.weatherInfo.hourly.data[i].icon + '.png';
    		tempMin = parseInt(city.weatherInfo.daily.data[i].temperatureMin).toString() + '˚';
    	    tempMax = parseInt(city.weatherInfo.daily.data[i].temperatureMax).toString() + '˚';

    		var ulHTML = [
                   '<li>', day, '</li>',
                   '<li>', '<img src = "', icon, '">',
                   '<li>', tempMax, '</li>',
                   '<li>', tempMin, '</li>'
    		].join('');
    		n.innerHTML = ulHTML;
    	});
    	
    //update today details
        //update today summary
        ul = $('.today-summary');
        summary = city.weatherInfo.daily.summary;
        ul.html(summary);

        //update today detail list
        li = $('.today-details-list ul li:last-child');
        var sunrise = city.weatherInfo.daily.data[0].sunriseTime,
            sunset  = city.weatherInfo.daily.data[0].sunsetTime,
            offset =  city.weatherInfo.offset,
            sunriseDate = this.getLocalDate(sunrise, offset),
            sunsetDate = this.getLocalDate(sunset, offset),
            rain    = city.weatherInfo.daily.data[0].precipProbability,
            humidity = city.weatherInfo.daily.data[0].humidity,
            windSpeed = city.weatherInfo.daily.data[0].windSpeed,
            windBearing = this.windBearing(city.weatherInfo.daily.data[0].windBearing),
            feelLike = parseInt(city.weatherInfo.currently.apparentTemperature).toString() + '˚',
            precip =   city.weatherInfo.daily.data[0].precipIntensityMax,
            pressure = city.weatherInfo.daily.data[0].pressure,
            visibility = city.weatherInfo.daily.data[0].visibility;

        
            li[0].innerHTML = sunriseDate.getHours().toString() + ':' + sunriseDate.getMinutes().toString() + ((sunriseDate.getHours() <= 11)? ' AM' : ' PM');
            li[1].innerHTML = sunsetDate.getHours().toString() + ':' + sunsetDate.getMinutes().toString() + ((sunsetDate.getHours() <= 11)? ' AM' : ' PM');
            li[2].innerHTML = (rain * 100) + '%';
            li[3].innerHTML = (humidity * 100) + '%';
            li[4].innerHTML = windSpeed + ' mph ' + windBearing;
            li[5].innerHTML = feelLike;
            li[6].innerHTML = (precip === 0)? '--' : (precip + ' in');
            li[7].innerHTML = (pressure * 0.000295299830714100).toFixed(2) + ' in';
            li[8].innerHTML = visibility + ' mi';

        //change background and border color
    	var date = this.getLocalDate(city.weatherInfo.currently.time, city.weatherInfo.offset),
    	    hour = date.getHours(),
    	    name = city.name,
    	    div = $('.city-detail.is-' + name),
    	    nav = $('nav.is-' + name); 

    	var ul = $('ul.today-overview'),
    	    sectionToday = $('section.today'),
    	    sectionForecast = $('section.forecast'),
    	    p = $('p.today-summary'),
    	    textLiOne = $('ul.today-overview li:nth-child(2)'),
    	    textLiTwo = $('ul.today-overview li:nth-child(4)');

    	if(hour < 7 || hour > 18){
    		//background
    		div.removeClass('day');
    		div.addClass('night');
    		nav.removeClass('day');
    		nav.addClass('night');

            //border
    		ul.removeClass('day');
    		sectionToday.removeClass('day');
    		sectionForecast.removeClass('day');
    		p.removeClass('day');
    		ul.addClass('night');
    		sectionToday.addClass('night');
    		sectionForecast.addClass('night');
    		p.addClass('night');

            //text
            textLiOne.removeClass('day');
            textLiTwo.removeClass('day');
            textLiOne.addClass('night');
            textLiTwo.addClass('night');
    	}else{
    		div.removeClass('night');
    		div.addClass('day');
    		nav.removeClass('night');
    		nav.addClass('day');

    		ul.removeClass('night');
    		sectionToday.removeClass('night');
    		sectionForecast.removeClass('night');
    		p.removeClass('night');
    		ul.addClass('day');
    		sectionToday.addClass('day');
    		sectionForecast.addClass('day');
    		p.addClass('day');

    		textLiOne.removeClass('night');
            textLiTwo.removeClass('night');
            textLiOne.addClass('day');
            textLiTwo.addClass('day');
    	}

        if(Weatherapp.degree === 'centigrade')
           this.degreeUnitConvertion('all', 'centigrade');
    },

     

    //feche all weather info of local and citylist
    updateAllWeatherInfo: function() {
    	if(this.local.latitude != null && this.local.longitude != null){
    		$.ajax({
    			url: 'https://api.forecast.io/forecast/2bd8f50c5345cf81d5ecfae7692b025f/' + Weatherapp.local.latitude + ',' + Weatherapp.local.longitude,
    			method: 'GET',
    			dataType: 'jsonp',
    			crossDomian: true
    		}).done(function(result) {
    			Weatherapp.local.weatherInfo = result;
    			Weatherapp.updateCityList(Weatherapp.local);
    			// Weatherapp.updateDetail(Weatherapp.local);
    	});
    	}
    	
    	if(this.city.length !== 0){
    		for(var i = 0; i < Weatherapp.city.length; ++i){
    			(function(index){
    				var city = Weatherapp.city[index];
    				$.ajax({
    					url: 'https://api.forecast.io/forecast/2bd8f50c5345cf81d5ecfae7692b025f/' + city.latitude + ',' + city.longitude,
    					method: 'GET',
    					dataType: 'jsonp',
    					crossDomian: true
    				}).done(function(result) {
    					city.weatherInfo = result;
    					Weatherapp.updateCityList(city);
    					// Weatherapp.updateDetail(city);
    				});
    			})(i);
    		}
    	}
    },

    //feche weather info of one city
    fetchWeatherInfo: function(city){
    	if(city.name === 'currentlocation'){
    		$.ajax({
    			url: 'https://api.forecast.io/forecast/7fb20ec11f721b8a0865ff2507a89249/' + city.latitude + ',' + city.longitude,
    			method: 'GET',
    			dataType: 'jsonp',
    			crossDomian: true
    		}).done(function(result) {
    			city.weatherInfo = result;
    		    Weatherapp.updateCityList(city);
    	    });
    	}else{
    		$.ajax({
    			url: 'https://api.forecast.io/forecast/7fb20ec11f721b8a0865ff2507a89249/' + city.latitude + ',' + city.longitude,
    			method: 'GET',
    			dataType: 'jsonp',
    			crossDomian: true
    		}).done(function(result) {
    			city.weatherInfo = result;
    			Weatherapp.addCityList(city);
    	    });
    	}
    },
	// showLocation: function(pos) {
	// 	$('.is-sanjose .time').html(pos.coords.latitude);
	// },

	showError: function(error) {
		// document.getElementById('error').innerHTML = error.message;
		alert(error.message);
	},

	getLocalLocation: function() {
		if (navigator.geolocation) {
			var options = {
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0
			}

			var getLocation = function(pos) {
				// alert(pos.coords.latitude);
				Weatherapp.local.latitude = pos.coords.latitude;
				Weatherapp.local.longitude = pos.coords.longitude;
				//fetch local weather
				Weatherapp.fetchWeatherInfo(Weatherapp.local);
			};

			navigator.geolocation.getCurrentPosition(getLocation, Weatherapp.showError, options);
		} else {
			showError();
		}
	},

	initCityList: function(){
		var size = this.city.length;
		if(size !== 0){
			var city;
			for(var i = 0; i < size; ++i){
				city = Weatherapp.city[i];
				// this.addCityList(city);
				this.fetchWeatherInfo(city);
			}
		}

        //add nav button event
		$('.prev-button').click(function(){
			var dots = $('.dot');
			$(dots[0]).addClass('current');
			$(dots[1]).removeClass('current');
		});
		$('.next-button').click(function(){
			var dots = $('.dot');
			$(dots[0]).removeClass('current');
			$(dots[1]).addClass('current');
		});

        //add degree button event
        $('.degree-conversion-button').click(function(){
            //judge if current page is list or detail
            var page, degree,
                btnCent = $('.centigrade'),
                btnFah = $('.fahrenheit');

            // if($('.cities-list').attr('style')){
            //     page = 'detail';
            // }else{
            //     page = 'list';
            // }

            //judge the current degree unit
            if(Weatherapp.degree === 'fahrenheit'){
                btnFah.removeClass('current');
                btnCent.addClass('current');
                Weatherapp.degreeUnitConvertion('all', 'centigrade');
                Weatherapp.degree = 'centigrade';
            }else{
                btnCent.removeClass('current');
                btnFah.addClass('current');
                Weatherapp.degreeUnitConvertion('all', 'fahrenheit');
                Weatherapp.degree = 'fahrenheit';
            }
        });
	},

    //setup nav
	setupNav: function(name, i){
		var prevCity = '',
		    nextCity = '',
		    leftBtn = $('.prev-button'),
		    rightBtn = $('.next-button');

            //invalid two buttons
            leftBtn.addClass('disabled');
            rightBtn.addClass('disabled');
		    leftBtn.find('a').attr('href','javascript:void(0)');
		    rightBtn.find('a').attr('href','javascript:void(0)');

		if(name === 'currentlocation'){
			if(this.city.length !== 0){
				nextCity = '#city/' + this.city[0].name;
				rightBtn.find('a').attr('href', nextCity);
				rightBtn.removeClass('disabled');
			}
		}else{
			leftBtn.removeClass('disabled');
			if(i === 0){
				prevCity = '#city/currentlocation';
				leftBtn.find('a').attr('href', prevCity);
			}else{
				prevCity = '#city/' + this.city[i - 1].name;
				leftBtn.find('a').attr('href', prevCity);
			}

			if(this.city[i + 1]){
				nextCity = '#city/' + this.city[i + 1].name;
				rightBtn.find('a').attr('href', nextCity);
				rightBtn.removeClass('disabled');
			}
		}
	},

	handleRoute: function(){
		var hash = window.location.hash,
		    self = Weatherapp;

		$('div.city-detail').attr('class', 'city-detail');
		$('nav').attr('class', '');

		if(hash == '' || hash == '#'){
			$('div.city-detail').hide();
			$('nav').hide();
			$('div.cities-list').show();

            //update citylist
            self.updateCityList(self.local);
            var city;
            for(var i = 0; i < self.city.length; ++i){
                city = self.city[i];
                self.updateCityList(city);
            }

		}else{
			var components = hash.split('/');

			$('div.cities-list').hide();
			$('div.city-detail').addClass('is-' + components[1]);
			$('nav').addClass('is-' + components[1]);
			$('div.city-detail').show();
			$('nav').show();

			if(components[1] == 'currentlocation'){
				self.updateDetail(self.local);
				self.setupNav(components[1]);
				return;
			}

			var city;
			for(var i = 0; i < self.city.length; ++i){
				city = self.city[i];
				if(city.name == components[1]){
					self.updateDetail(city);
					self.setupNav(components[1], i);
					break;
				}
			}
		}
	},

    //initial the app
    init: function() {
    	this.getLocalLocation();
    	this.initCityList();

    	// fetch weather info every 10 mins
    	setInterval('Weatherapp.updateAllWeatherInfo()', this.interval); 

    	// update time every one minute
    	setInterval('Weatherapp.updateTime()', 1000*60);

    	$(window).on('hashchange', this.handleRoute);
    	// this.handleRoute();
    }

};