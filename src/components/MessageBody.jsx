import React from 'react'


const MassageBody = (props)=> {

    return (
            <table>
                <tr>
                    <th scope="col">Nikname</th>
                    <th scope="col">Message</th>
                </tr>
            {props.msgs.map((msg) => (
                <tr key={msg.id}><td>{msg.nickname}</td><td>{msg.message}</td>
                    </tr>

            ))}
            </table>

    );
};

export default MassageBody;