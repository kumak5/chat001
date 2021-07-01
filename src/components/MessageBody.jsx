import React from 'react'

/**
 *
 *
 * @param props {number}- msg.id - айди сообщения,
 * @param props {number}- msg.date - время сообщения,
 * @param props {string}- msg.nickname - имя пользователя(почта при регистрации),
 * @param props {string}- msg.message - сообщение
 *
 * @returns {*} - возвращает таблицу с сообщениями
 * @constructor
 */
const MassageBody = (props) => {

    return (
        <table>
            <tr>
                <th scope="col">Date____________</th>
                <th scope="col">Nikname</th>
                <th scope="col">Message</th>
            </tr>
            {props.msgs.slice(0).reverse().map((msg) => (
                <tr key={msg.id}>
                    <td>{new Date(msg.date).toISOString().slice(11, 22).toString()}</td>
                    <td>{msg.nickname}</td>
                    <td>{msg.message}</td>
                </tr>

            ))}
        </table>

    );
};

export default MassageBody;