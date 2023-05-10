// import classNames from 'classnames/bind';
// import { Link } from 'react-router-dom';
// import styles from './MyButtonn.module.scss';
// const cx = classNames.bind(styles);
// const MyButtonn = ({
//     effect = false,
//     to,
//     href,
//     onClick,
//     children,
//     // style
//     style = {},
//     borderWidth = 1,
//     color = { beforeBg: '', afterBg: '', textColorBefore: '', textColorAfter: '', borderColor: '', slideColor: '' },
//     padding = '',
//     fontSize,
//     // className
//     outline = false,
//     filled = false,
//     text = false,
//     scale = false,
//     secondary = false,
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
//         effect,
//         secondary,
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
//                 '--backdrop': color.beforeBg,
//                 '--borderWidth': borderWidth,
//                 '--buttonColor': color.afterBg,
//                 '--textColor': color.textColorBefore,
//                 '--bg': color.textColorAfter,
//                 '--borderColor': color.borderColor,
//                 '--slideColor': color.slideColor,
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

// export default MyButtonn;
