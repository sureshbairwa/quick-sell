import React from 'react';

const AvatarIcon = ({ name }) => {
  const getInitials = (name) => {
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0][0]; 
    } else if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`; 
    }
  };

  const getRandomColor = () => {
    const colors = ['#E57373', '#F06292', '#BA68C8', '#9575CD', '#7986CB', '#64B5F6', '#4DB6AC', '#81C784', '#FFB74D', '#FFD54F'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        width: '25px',
        height: '25px',
        borderRadius: '50%',
        backgroundColor: getRandomColor(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '16px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
      }}
    >
      {getInitials(name)}
    </div>
  );
};

export default AvatarIcon;
