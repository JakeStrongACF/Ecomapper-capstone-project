import React from 'react';
import SidebarForm from './sidebar_form.jsx';
import { NODE_TYPE, sidebarState, sidebarView } from '../constants/constants.ts';
import { NodeData, EdgeData } from '../constants/classes.jsx';

class DataSidebar extends React.Component {
  constructor(props) {
    super(props);
    // Each of the four specifications below is an array: [collapsed, expanded].
    // The first element is what the specification is when the data-sidebar is collapsed,
    // and the second element is when it's expanded.
    //
    // className for the main sidebar div
    this.data_sidebar = ['data-sidebar w-[15px]', 'data-sidebar'];
    // svg coordinates for the collapse/expand arrow on the tab/button
    this.svg_coods = ['12,20 12,40 3,30', '4,20 4,40 13,30'];
    // Function to be called when the tab/button is clicked
    this.onclick = [this.expand, this.collapse];
    this.state = {
      content: this.renderContent(sidebarState.expanded, sidebarView.person),
      view: sidebarView.person,
    };

    // https://chafikgharbi.com/react-call-child-method/
    this.child = React.createRef();
    /* 
      Used this to pull data from the form elements without it clearing 
      the textbox:
      https://stackoverflow.com/questions/69092720/cant-type-in-react-textfield-input 
    */
    this.expand = this.expand.bind();
    this.collapse = this.collapse.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  clearState = () => {
    this.child.current.clearState();
  };

  collapse = () => {
    this.setState({
      content: this.renderContent(sidebarState.closed, this.state.view),
    });
  };

  expand = () => {
    if (this.state.view == sidebarView.closed) {
      this.setState({
        view: sidebarView.none,
        content: this.renderContent(sidebarState.open, sidebarView.none),
      });
    } else {
      this.setState({
        content: this.renderContent(sidebarState.open, this.state.view),
      });
    }
  };

  /* renderContent isn't actually necessary here as it works without it,
    but it's useful like this for updating the div and seeing it change */
  changeView = (new_view) => {
    console.log('changing view...');
    if (new_view != sidebarView.closed && new_view != sidebarView.none) {
      this.setState({
        content: this.renderContent(sidebarState.open, new_view),
        view: new_view,
      });
    } else {
      this.setState({
        content: this.renderContent(sidebarState.closed, sidebarView.closed),
        view: new_view,
      });
    }
    return 1;
  };

  renderContent(status) {
    /* Fancy way to do an if/else statement, doing it since I was having issues
      getting variables to stay changed outside an if statement
      https://stackoverflow.com/questions/31971801/setting-a-javascript-variable-with-an-if-statement-should-the-var-x-be-in
    */
    let barState = status === sidebarState.open ? 1 : 0;

    return (
      <>
        <div className={this.data_sidebar[barState]}>
          <div className="data-sidebar-tab" onClick={this.onclick[barState]}>
            <svg className="data-sidebar-tab-arrow" fill="currentColor">
              <polygon points={this.svg_coods[barState]} />
            </svg>
          </div>
          <div className="data-sidebar-background grid justify-items-center">
            <SidebarForm
              ref={this.child}
              parent_node={this.props.node}
              parent_edge={this.edge}
              changeView={this.changeView}
            />
          </div>
        </div>
      </>
    );
  }

  render() {
    return <>{this.state.content}</>;
  }
}

export default DataSidebar;
