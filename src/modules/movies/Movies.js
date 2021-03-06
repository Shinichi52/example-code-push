import React, { Component } from 'react';
import {
	RefreshControl,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as moviesActions from './movies.actions';
import CardOne from './components/CardOne';
import CardTwo from './components/CardTwo';
import ProgressBar from '../_global/ProgressBar';
import styles from './styles/Movies';
import { iconsMap } from '../../utils/AppIcons';

class Movies extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			isRefreshing: false
		};

		this._viewMovie = this._viewMovie.bind(this);
		this._onRefresh = this._onRefresh.bind(this);
		this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
	}

	componentWillMount() {
		this._retrieveMovies();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.nowPlayingMovies && nextProps.popularMovies) {
			this.setState({ isLoading: false });
		}
	}

	_retrieveMovies(isRefreshed) {
		this.props.actions.retrieveNowPlayingMovies();
		this.props.actions.retrievePopularMovies();
		if (isRefreshed && this.setState({ isRefreshing: false }));
	}

	_viewMoviesList(type, title) {
		let rightButtons = [];
		if (Platform.OS === 'ios') {
			rightButtons = [
				{
					id: 'close',
					title: 'Close',
					icon: iconsMap['ios-close']
				}
			];
		}
		this.props.navigator.showModal({
			title,
			screen: 'movieapp.MoviesList',
			passProps: {
				type
			},
			navigatorButtons: {
				rightButtons
			}
		});
	}

	_viewMovie(movieId) {
		this.props.navigator.showModal({
			screen: 'movieapp.Movie',
			passProps: {
				movieId
			},
			backButtonHidden: true,
			navigatorButtons: {
				rightButtons: [
					{
						id: 'close',
						icon: iconsMap['ios-arrow-round-down']
					}
				]
			}
		});
	}

	_onRefresh() {
		this.setState({ isRefreshing: true });
		this._retrieveMovies('isRefreshed');
	}

	_onNavigatorEvent(event) {
		if (event.type === 'NavBarButtonPress') {
			if (event.id === 'search') {
				let rightButtons = [];
				if (Platform.OS === 'ios') {
					rightButtons = [
						{
							id: 'close',
							title: 'Close',
							icon: iconsMap['ios-close']
						}
					];
				}
				this.props.navigator.showModal({
					screen: 'movieapp.Search',
					title: 'Search',
					navigatorButtons: {
						rightButtons
					}
				});
			}
		}
	}

	render() {
		const { nowPlayingMovies, popularMovies } = this.props;
		const iconPlay = <Icon name="md-play" size={21} color="#9F9F9F" style={{ paddingLeft: 3, width: 22 }} />;
		const iconTop = <Icon name="md-trending-up" size={21} color="#9F9F9F" style={{ width: 22 }} />;
		const iconUp = <Icon name="md-recording" size={21} color="#9F9F9F" style={{ width: 22 }} />;

		return (
			this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
				<ScrollView
					style={styles.container}
					refreshControl={
						<RefreshControl
							refreshing={this.state.isRefreshing}
							onRefresh={this._onRefresh}
							colors={['#EA0000']}
							tintColor="white"
							title="loading..."
							titleColor="white"
							progressBackgroundColor="white"
						/>
					}>
					<Swiper
						autoplay
						autoplayTimeout={4}
						showsPagination={false}
						height={248}>
						{nowPlayingMovies.results.map(info => (
							<CardOne key={info.id} info={info} viewMovie={this._viewMovie} />
						))}
					</Swiper>
					<View>
						<View style={styles.listHeading}>
							<Text style={styles.listHeadingLeft}>Popular</Text>
							<TouchableOpacity>
								<Text
									style={styles.listHeadingRight}
									onPress={this._viewMoviesList.bind(this, 'popular', 'Popular')}>
									See all
							</Text>
							</TouchableOpacity>
						</View>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							{popularMovies.results.map(info => (
								<CardTwo key={info.id} info={info} viewMovie={this._viewMovie} />
							))}
						</ScrollView>
						<View style={styles.browseList}>
							<TouchableOpacity activeOpacity={0.7}>
								<View style={styles.browseListItem}>
									{iconPlay}
									<Text
										style={styles.browseListItemText}
										onPress={this._viewMoviesList.bind(this, 'now_playing', 'Now Playing')}>
										Now Playing
								</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity activeOpacity={0.7}>
								<View style={styles.browseListItem}>
									{iconTop}
									<Text style={styles.browseListItemText} onPress={this._viewMoviesList.bind(this, 'top_rated', 'Top Rated')}>
										Top Rated
								</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity activeOpacity={0.7}>
								<View style={styles.browseListItem}>
									{iconUp}
									<Text
										style={styles.browseListItemText}
										onPress={this._viewMoviesList.bind(this, 'upcoming', 'Upcoming')}>
										Upcoming
								</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
		);
	}
}

Movies.propTypes = {
	actions: PropTypes.object.isRequired,
	nowPlayingMovies: PropTypes.object.isRequired,
	popularMovies: PropTypes.object.isRequired,
	navigator: PropTypes.object
};

function mapStateToProps(state, ownProps) {
	return {
		nowPlayingMovies: state.movies.nowPlayingMovies,
		popularMovies: state.movies.popularMovies
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(moviesActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Movies);
