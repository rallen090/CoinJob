import * as React from 'react';
import { NavMenu } from './NavMenu';

export class Layout extends React.Component<{}, {}> {
    public render() {
		return <div>
			<div>
				<NavMenu />
			</div>
            <div>
                    { this.props.children }
            </div>
        </div>;
    }
}
