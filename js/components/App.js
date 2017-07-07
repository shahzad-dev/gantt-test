import React from 'react';
import Relay from 'react-relay';
import HobbiesList from './units/Hobbies';
import ReactGantt from 'gantt-for-react';
import moment from 'moment';

class App extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
          viewMode: 'Month',
          tasks: this.tasks()
      }
  }

  tasks = () => {
      let names = [
        ["Redesign website", [0, 7]],
        ["Write new content", [1, 4]],
        ["Apply new styles", [3, 6]],
        ["Review", [7, 7]],
        ["Deploy", [8, 9]],
        ["Go Live!", [10, 10]]
      ];

      let tasks = names.map(function(name, i) {
        let today = new Date();
        let start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        let end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        start.setDate(today.getDate() + name[1][0]);
        end.setDate(today.getDate() + name[1][1]);
        return {
          start: start,
          end: end,
          name: name[0],
          id: "Task " + i,
          progress: parseInt(Math.random() * 100, 10)
        }
      });
      tasks[1].dependencies = "Task 0"
      tasks[2].dependencies = "Task 1, Task 0"
      tasks[3].dependencies = "Task 2"
      tasks[5].dependencies = "Task 4"
      return tasks;
  }
    setupViewMode = () => {
          let tasks = this.tasks();
          this.setState({
            viewMode: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'][parseInt(Math.random() * 3 + 1)],
            tasks: tasks.slice(0, parseInt(Math.random() * 4 + 1))
          });
    }
    componentDidMount = () => {
      //setInterval(this.setupViewMode.bind(this), 5000)
    }

    customPopupHtml = (task) => {
      const end_date = task._end.format('MMM D');
      return `
        <div class="details-container">
          <h5>${task.name}</h5>
          <p>Expected to finish by ${end_date}</p>
          <p>${task.progress}% completed!</p>
        </div>
      `;
    }
    /*<HobbiesList Viewer={this.props.Viewer} />
    <ReactGantt
        tasks={this.getTasks()}
        viewMode={this.state.viewMode}

        onClick={this._func}
        onDateChange={this._func}
        onProgressChange={this._func}
        onViewChange={this._func}
        customPopupHtml={this._html_func} />*/
      render() {
        const styles = {
            "list": {
                fontSize: 14,
                color: "#555",
                paddingLeft: 5,
                borderBottom: "2px solid #F3F3F3",
                height: 35.5,
                lineHeight: "35.5px"
            }
        }
        console.log(this.state.tasks)
        return (
                <div className='parent'>
                  <label> ReactGantt Component<br/>View Mode: <b>{this.state.viewMode}</b> </label>
                  - <button onClick={this.setupViewMode.bind(this)}>Change View Mode</button><br/>
                    <div style={{overflow: 'scroll', float: "left", width: "30%", borderRight: "2px solid #e9e9e9"}}>
                        <div style={{height: 58, borderTop: "1px solid #e9e9e9", borderBottom: "2px solid #e9e9e9"}}>Task | Start Date | End Date</div>
                        <ul style={{margin: 0, listStyleType: "none", padding: "0px"}}>
                            {this.state.tasks.map((task, i) =>
                                <li key={i}
                                    style={{...styles.list, backgroundColor: ((i % 2) === 0 ? "#FFF" : "#F5F5F5")} }>
                                    {task.id} - {task.name}</li>
                            )}
                        </ul>
                    </div>
                      <div style={{overflow: 'scroll', float: "left", width: "69%"}}>
                        <ReactGantt tasks={this.state.tasks}
                                    viewMode={this.state.viewMode}
                                    customPopupHtml={this.customPopupHtml} />
                      </div>
                </div>)
      }
}

export default Relay.createContainer(App, {
  fragments: {
    Viewer: () => Relay.QL`
      fragment on Viewer {
        id,
        ${HobbiesList.getFragment('Viewer')},
      }
    `,
  },
});
