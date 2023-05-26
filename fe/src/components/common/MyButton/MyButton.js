import React from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './MyButton.module.scss';

const cx = classNames.bind(styles);

const MyButton = React.forwardRef(
    (
        {
            effect = false,
            to,
            href,
            onClick,
            children,
            // style
            style = {},
            borderWidth = 1,
            color = { bgColor: '', mainColor: '', subColor: '', borderColor: '' },
            padding = '',
            fontSize,
            fontWeight,
            // className
            active = false,
            outline = false,
            filled = false,
            text = false,
            scale = false,
            disable = false,
            className,
            //another Attribute
            ...passProps
        },
        ref,
    ) => {
        let Comp = 'button';
        const props = {
            onClick,
            ref, // Forwarding ref to the button element

            //another Attribute
            ...passProps,
        };
        if (disable) {
            Object.keys(props).forEach((key) => {
                if (key.startsWith('on') && typeof props[key] === 'function') {
                    delete props[key];
                }
            });
        }
        if (to) {
            props.to = to;
            Comp = Link;
        } else if (href) {
            props.href = href;
            Comp = 'a';
        }

        const classes = cx('dbe-btn', {
            active,
            effect,
            filled,
            outline,
            text,
            scale,
            disable,
            [className]: className,
        });

        return effect ? (
            <Comp
                className={classes}
                {...props}
                style={{
                    ...style,
                    '--fontSize': fontSize,
                    '--fontWeight': fontWeight,
                    '--padding': padding,
                    '--borderWidth': borderWidth,
                    '--bgColor': color.bgColor,
                    '--mainColor': color.mainColor,
                    '--subColor': color.subColor,
                    '--borderColor': color.borderColor,
                }}
            >
                {children}
                <span />
                <span />
                <span />
                <span />
                <b aria-hidden="true">{children}</b>
                <b aria-hidden="true">{children}</b>
                <b aria-hidden="true">{children}</b>
                <b aria-hidden="true">{children}</b>
            </Comp>
        ) : (
            <Comp
                className={classes}
                {...props}
                style={{
                    ...style,
                    '--fontSize': fontSize,
                    '--fontWeight': fontWeight,
                    '--padding': padding,
                    '--borderWidth': borderWidth,
                    '--bgColor': color.bgColor,
                    '--mainColor': color.mainColor,
                    '--subColor': color.subColor,
                    '--borderColor': color.borderColor,
                }}
            >
                {children}
            </Comp>
        );
    },
);

export default MyButton;
