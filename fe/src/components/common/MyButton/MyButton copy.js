// import classNames from 'classnames/bind';
// import { forwardRef } from 'react';
// import { Link } from 'react-router-dom';
// import styles from './MyButton.module.scss';
// const cx = classNames.bind(styles);
// const MyButton = ({
//     effect = false,
//     to,
//     href,
//     onClick,
//     children,
//     // style
//     style = {},
//     borderWidth = 1,
//     color = { bgColor: '', mainColor: '', subColor: '', borderColor: '' },
//     padding = '',
//     fontSize,
//     // className
//     active = false,
//     outline = false,
//     filled = false,
//     text = false,
//     scale = false,
//     disable = false,
//     className,
//     //another Attribute
//     ...passProps
// }) => {
//     let Comp = 'button';
//     const props = {
//         onClick,

//         //another Attribute
//         ...passProps,
//     };
//     if (disable) {
//         Object.keys(props).forEach((key) => {
//             if (key.startsWith('on') && typeof props[key] === 'function') {
//                 delete props[key];
//             }
//         });
//     }
//     if (to) {
//         props.to = to;
//         Comp = Link;
//     } else if (href) {
//         props.href = href;
//         Comp = 'a';
//     }

//     const classes = cx('dbe-btn', {
//         active,
//         effect,
//         filled,
//         outline,
//         text,
//         scale,
//         disable,
//         [className]: className,
//     });

//     return (
//         <Comp
//             className={classes}
//             {...props}
//             style={{
//                 ...style,
//                 '--fontSize': fontSize,
//                 '--padding': padding,
//                 '--borderWidth': borderWidth,
//                 '--bgColor': color.bgColor,
//                 '--mainColor': color.mainColor,
//                 '--subColor': color.subColor,
//                 '--borderColor': color.borderColor,
//             }}
//         >
//             {children}
//             <span />
//             <span />
//             <span />
//             <span />
//             <b aria-hidden="true">{children}</b>
//             <b aria-hidden="true">{children}</b>
//             <b aria-hidden="true">{children}</b>
//             <b aria-hidden="true">{children}</b>
//         </Comp>
//     );
// };

// export default MyButton;

// export const MyButtonWithRef = forwardRef((props, ref) => <MyButton ref={ref} {...props} />);
