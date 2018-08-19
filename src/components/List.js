import React from 'react';

class List extends React.Component {
    render() {
        return (
            <tr>
                <td className='recTd'>{this.props.printList.userName}</td>
                <td className='recTd'>{this.props.printList.month}/{this.props.printList.year}</td>
                <td className='recTd'>{this.props.printList.sum_hours}</td>
                <td className='recTd'>{this.props.printList.avg_per_day}</td>
                <td className='recTd'>{this.props.printList.sum_extra_hours}</td>
            </tr>
        );
    }
}
export default List;