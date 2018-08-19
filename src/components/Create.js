import React from 'react';
import DatePicker from 'react-datepicker';
import Dropdown from 'react-dropdown'

import 'react-datepicker/dist/react-datepicker.css';
import 'react-dropdown/style.css'

 
const Create = (props) => (
    <form onSubmit={props.validate}>
        <div className='listFrame'>
            <p>Add a new record:</p>
            <table>
                <tbody>
                    <tr>
                        <td width='170px'>
                            Date:
                        </td>
                        <td>
                            <DatePicker selected={props.date} onChange={props.onChangeDate} dateFormat="DD/MM/YYYY"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Start Hour:
                        </td>
                        <td height='60px'>
                            <Dropdown options={props.hours} onChange={props.onChangeStartHour} value={props.startHour} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            End Hour:
                        </td>
                        <td>
                            <Dropdown options={props.hours} onChange={props.onChangeEndHour} value={props.endHour} />
                        </td>
                    </tr>
                    <tr>
                        <td height='60px'>
                            User Name:
                        </td>
                        <td>
                            <input type="text" name="userName" onChange={props.onChangeName} value={props.userName} placeholder="Username Email..." />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan='2'>
                            <p><button> Add Record </button></p>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan='2'>
                            <p className='error'>{props.error}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </form>
);

export default Create;