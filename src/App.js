import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { ReactComponent as Menu } from './assest/3 dot menu.svg';
import { ReactComponent as Plus } from './assest/add.svg';
import { ReactComponent as HighPriority } from './assest/High.svg';
import { ReactComponent as MediumPriority } from './assest/Img - Medium Priority.svg';
import { ReactComponent as LowPriority } from './assest/Img - Low Priority.svg';
import { ReactComponent as UrgentPriority } from './assest/SVG - Urgent Priority colour.svg';
import { ReactComponent as NoPriority } from './assest/No-priority.svg';
import { ReactComponent as DoneIcon } from './assest/Done.svg';
import { ReactComponent as TodoIcon } from './assest/To-do.svg';
import { ReactComponent as ProgressIcon } from './assest/in-progress.svg';
import { ReactComponent as CancelledIcon } from './assest/Cancelled.svg';
import { ReactComponent as BacklogIcon } from './assest/Backlog.svg';
import { ReactComponent as DotIcon } from './assest/3 dot menu.svg';
import { ReactComponent as DisplayIcon } from './assest/Display.svg';
import { ReactComponent as DownIcon } from './assest/down.svg';
import AvatarIcon from './AvatarIcon';

const API_URL = 'https://api.quicksell.co/v1/internal/frontend-assignment';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState(localStorage.getItem('groupBy') || 'priority');
  const [orderBy, setOrderBy] = useState(localStorage.getItem('orderBy') || 'priority');
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setTickets(response.data.tickets);
        setUsers(response.data.users);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('groupBy', groupBy);
  }, [groupBy]);

  useEffect(() => {
    localStorage.setItem('orderBy', orderBy);
  }, [orderBy]);

  const priorityGroups = {
    0: { label: 'No Priority', icon: <NoPriority />, tickets: [] },
    1: { label: 'Low', icon: <LowPriority />, tickets: [] },
    2: { label: 'Medium', icon: <MediumPriority />, tickets: [] },
    3: { label: 'High', icon: <HighPriority />, tickets: [] },
    4: { label: 'Urgent', icon: <UrgentPriority />, tickets: [] },
  };

  const statusGroups = {
    Todo: { label: 'Todo', icon: <TodoIcon />, tickets: [] },
    'In progress': { label: 'In Progress', icon: <ProgressIcon />, tickets: [] },
    Backlog: { label: 'Backlog', icon: <BacklogIcon />, tickets: [] },
    Done: { label: 'Done', icon: <DoneIcon />, tickets: [] },
    Cancelled: { label: 'Cancelled', icon: <CancelledIcon />, tickets: [] },
  };

  const groupTicketsByPriority = () => {
    Object.values(priorityGroups).forEach(group => group.tickets = []);
    tickets.forEach(ticket => {
      const priority = ticket.priority;
      if (priorityGroups[priority]) {
        priorityGroups[priority].tickets.push(ticket);
      }
    });
    return priorityGroups;
  };

  const groupTicketsByUser = () => {
    const userGroups = {};
    users.forEach(user => {
      userGroups[user.id] = { label: user.name, icon: <AvatarIcon name={user.name} />, tickets: [] };
    });
    tickets.forEach(ticket => {
      const userId = ticket.userId;
      if (userGroups[userId]) {
        userGroups[userId].tickets.push(ticket);
      }
    });
    return userGroups;
  };

  const groupTicketsByStatus = () => {
    Object.values(statusGroups).forEach(group => group.tickets = []);
    tickets.forEach(ticket => {
      const status = ticket.status;
      if (statusGroups[status]) {
        statusGroups[status].tickets.push(ticket);
      }
    });
    return statusGroups;
  };

  const sortTickets = (groupedTickets) => {
    Object.keys(groupedTickets).forEach(key => {
      groupedTickets[key].tickets.sort((a, b) => {
        if (orderBy === 'priority') {
          return b.priority - a.priority;
        } else if (orderBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
    });
    return groupedTickets;
  };

  const groupedTickets = groupBy === 'priority'
    ? groupTicketsByPriority()
    : groupBy === 'user'
    ? groupTicketsByUser()
    : groupTicketsByStatus();

  const sortedTickets = sortTickets(groupedTickets);

  return (
    <div className="app-container">
      <div className="header">
        <div className="display-button">
          <button className="display-button__content" onClick={toggleDropdown}>
            
            <div>
            <DisplayIcon />
            </div>
           
            <div>
            Display
            </div>
            
            <div>
            <DownIcon />

            </div>
          </button>
          {isDropdownVisible && (
            <div className="dropdown-menu">
              <div className='groupby-'>
                <div className="dropdown-label">Group By:</div>
                <div>
                  <select onChange={(e) => setGroupBy(e.target.value)} value={groupBy} className="dropdown-select">
                    <option value="priority">Priority</option>
                    <option value="user">User</option>
                    <option value="status">Status</option>
                  </select>
                </div>
              </div>
              <div className='groupby-'>
                <div className="dropdown-label">Order By:</div>
                <div>
                  <select onChange={(e) => setOrderBy(e.target.value)} value={orderBy} className="dropdown-select">
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="priority-container">
        {Object.keys(sortedTickets).map(key => (
          <div key={key} className="priority-group">
            <div className="priority-header">
              {sortedTickets[key].icon}
              <span className='groupname'>{sortedTickets[key].label} {sortedTickets[key].tickets.length}</span>
              <div style={{ flex: 1 }}></div>
              <Plus />
              <Menu />
            </div>

            {sortedTickets[key].tickets.map(ticket => (
              <div key={ticket.id} className="ticket-item">
                <div className="ticket-id">{ticket.id} </div>
                {groupBy === 'priority' && (
                  <>
                    <div className='profileicon'>
                      <AvatarIcon name={users.find(user => user.id === ticket.userId)?.name || 'Unknown'} />
                    </div>
                    <div className="ticket-title">
                      <DoneIcon /> {ticket.title}
                    </div>
                    <div className="ticket-tag">
                      <DotIcon /> {ticket.tag.join(', ')}
                    </div>
                  </>
                )}
                {groupBy === 'status' && (
                  <>
                    <div className="ticket-title">{ticket.title}</div>
                    <div className="ticket-tag">
                      {priorityGroups[ticket.priority]?.icon}
                      {ticket.tag.join(', ')}
                    </div>
                  </>
                )}
                {groupBy === 'user' && (
                  <>
                    <div className="ticket-title">
                      {statusGroups[ticket.status]?.icon}
                      {ticket.title}
                    </div>
                    <div className="ticket-tag">
                      {priorityGroups[ticket.priority]?.icon}
                      {ticket.tag.join(', ')}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
