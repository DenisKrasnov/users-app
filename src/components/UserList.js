import React from 'react';
import { connect } from 'react-redux';
import { Table, Pagination, ProgressBar } from 'react-bootstrap';
import { push } from 'react-router-redux';

import UserListElement from './UserListElement';
import UserDelete from './UserDelete';

class UserList extends React.Component {
  constructor(props) {
    super(props);
    //when we dont have any users, update the state with the users list taken from the api
    if(0 === this.props.users.length) {
      this.props.dispatch({
        type: 'usersFetchList',
      });
    }

    this.changePage = this.changePage.bind(this);
  }
  render(){
    //pagination
    const per_page = 10;
    const pages = Math.ceil(this.props.users.length / per_page);
    const current_page = this.props.page;
    const start_offset = (current_page - 1) * per_page;
    let start_count = 0;

    if(this.props.users.length){
      //show the list of users
      return(
        <div>
        <Table bordered hover responsive striped>
          <thead>
            <tr>
              <th>id</th>
              <th>Username</th>
              <th>Job</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.props.users.map((user, index) => {
              if(index >= start_offset && start_count < per_page){
                start_count++;
                return(
                  <UserListElement key={user.id} user={user}/>
                );
              }else return null;
            })}
          </tbody>
        </Table>
        <Pagination className="user-pagination pull-right"
                    bsSize="medium"
                    maxButtons={10}
                    first
                    last
                    next
                    prev
                    boundaryLinks
                    items={pages}
                    activePage={current_page}
                    onSelect={this.changePage}/>
        <UserDelete/>
        </div>
      );
    }else {
      //show the loading state
      return(
        <ProgressBar active now={100}/>
      );
    }
  }
  //chnage the users lists current page
  changePage(page){
    this.props.dispatch(push('/?page=' + page));
  }
}

function mapStateToProps(state) {
  return({
    users: state.users.list || [],
    page: (Number(state.routing.location.search.substr(-1)) !== "") ?      Number(state.routing.location.search.substr(-1)) : 1,
  });
}
export default connect(mapStateToProps)(UserList);
