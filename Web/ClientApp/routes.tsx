import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import FetchData from './components/samples/FetchData';
import Verify from './components/Verify';

export const routes = <Layout>
	<Route exact path='/' component={Home} />
	<Route path='/verify' component={Verify} />
	{/*<Route path='/counter' component={ Counter } />
	<Route path='/fetchdata/:startDateIndex?' component={FetchData} />*/}
</Layout>;
