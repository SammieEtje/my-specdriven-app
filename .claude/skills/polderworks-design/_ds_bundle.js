/* @ds-bundle: {"format":4,"namespace":"PolderworksDesignSystem_212414","components":[{"name":"CodeBlock","sourcePath":"components/data/CodeBlock/CodeBlock.jsx"},{"name":"Table","sourcePath":"components/data/Table/Table.jsx"},{"name":"Callout","sourcePath":"components/feedback/Callout/Callout.jsx"},{"name":"StatusBadge","sourcePath":"components/feedback/StatusBadge/StatusBadge.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag/Tag.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs/Tabs.jsx"},{"name":"Dialog","sourcePath":"components/overlay/Dialog/Dialog.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card/Card.jsx"}],"sourceHashes":{"components/data/CodeBlock/CodeBlock.jsx":"036a28ddec33","components/data/Table/Table.jsx":"85431b884398","components/feedback/Callout/Callout.jsx":"769a693f8125","components/feedback/StatusBadge/StatusBadge.jsx":"918ca0962503","components/feedback/Tag/Tag.jsx":"6b0d225dd806","components/feedback/Toast/Toast.jsx":"230c09d5d7e7","components/feedback/Tooltip/Tooltip.jsx":"5e638f89589f","components/forms/Button/Button.jsx":"eecd2d6e798b","components/forms/Checkbox/Checkbox.jsx":"cb228779f41d","components/forms/Input/Input.jsx":"7f94c02255fb","components/forms/Radio/Radio.jsx":"f1b74d5c8204","components/forms/Select/Select.jsx":"36f5c7d1a4ff","components/forms/Switch/Switch.jsx":"caeb90a17219","components/navigation/Tabs/Tabs.jsx":"75ebc49bd35c","components/overlay/Dialog/Dialog.jsx":"9253601f92a7","components/surfaces/Card/Card.jsx":"3bb6357c2c41","ui_kits/loods-product/ReportViewer.jsx":"58d4f66affdc","ui_kits/loods-product/Terminal.jsx":"e2bd160af249","ui_kits/polderworks-site/Footer.jsx":"d2c97c737fc5","ui_kits/polderworks-site/Header.jsx":"9c7fd05963bc","ui_kits/polderworks-site/Hero.jsx":"2a527dc7461e","ui_kits/polderworks-site/ProductsSection.jsx":"f00d8c31ac89","ui_kits/polderworks-site/TrustSection.jsx":"52c77076c7c8"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PolderworksDesignSystem_212414 = window.PolderworksDesignSystem_212414 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/data/CodeBlock/CodeBlock.jsx
try { (() => {
function CodeBlock({
  children,
  prompt = '$',
  theme = 'dark'
}) {
  const isDark = theme === 'dark';
  return /*#__PURE__*/React.createElement("pre", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      lineHeight: 1.75,
      background: isDark ? 'var(--pw-panel-dark)' : 'var(--surface-sunken)',
      color: isDark ? 'var(--pw-muted-cool)' : 'var(--text-primary)',
      border: `1px solid ${isDark ? 'var(--pw-border-dark)' : 'var(--border-default)'}`,
      padding: '16px 18px',
      margin: 0,
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("code", null, prompt ? `${prompt} ` : '', children));
}
Object.assign(__ds_scope, { CodeBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/CodeBlock/CodeBlock.jsx", error: String((e && e.message) || e) }); }

// components/data/Table/Table.jsx
try { (() => {
function Table({
  columns = [],
  rows = []
}) {
  return /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-sans)',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(col => /*#__PURE__*/React.createElement("th", {
    key: col.key,
    style: {
      textAlign: col.align || 'left',
      background: 'var(--pw-navy-ink)',
      color: 'var(--pw-ice)',
      padding: '10px 14px',
      fontFamily: 'var(--font-mono)',
      fontWeight: 400,
      fontSize: 12
    }
  }, col.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((row, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, columns.map(col => /*#__PURE__*/React.createElement("td", {
    key: col.key,
    style: {
      textAlign: col.align || 'left',
      padding: '10px 14px',
      borderBottom: '1px solid var(--border-default)',
      color: 'var(--text-primary)'
    }
  }, row[col.key]))))));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Table/Table.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Callout/Callout.jsx
try { (() => {
const CONFIG = {
  blocker: {
    border: 'var(--pw-pilot-red)',
    label: 'Blocker · requires action',
    color: 'var(--pw-pilot-red)'
  },
  advisory: {
    border: 'var(--pw-channel-teal)',
    label: 'Advisory',
    color: 'var(--pw-channel-teal)'
  },
  info: {
    border: 'var(--pw-eu-gold)',
    label: 'Note',
    color: 'var(--text-primary)'
  }
};
function Callout({
  tone = 'advisory',
  title,
  children
}) {
  const c = CONFIG[tone] || CONFIG.advisory;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderLeft: `var(--border-width-accent) solid ${c.border}`,
      padding: '20px 24px',
      boxShadow: 'var(--shadow-sm)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: c.color,
      marginBottom: 8,
      fontWeight: 500
    }
  }, title || c.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-primary)'
    }
  }, children));
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Callout/Callout.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusBadge/StatusBadge.jsx
try { (() => {
const CONFIG = {
  blocker: {
    bg: 'var(--status-blocker-bg)',
    fg: 'var(--status-blocker-fg)',
    label: 'Blocker'
  },
  advisory: {
    bg: 'var(--status-advisory-bg)',
    fg: 'var(--status-advisory-fg)',
    label: 'Advisory'
  },
  clear: {
    bg: 'var(--status-clear-bg)',
    fg: 'var(--status-clear-fg)',
    label: 'Clear'
  }
};
function StatusBadge({
  status = 'advisory',
  children
}) {
  const c = CONFIG[status] || CONFIG.advisory;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      padding: '5px 11px',
      borderRadius: 'var(--radius-xs)',
      background: c.bg,
      color: c.fg
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor'
    }
  }), children || c.label);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusBadge/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tag/Tag.jsx
try { (() => {
function Tag({
  children,
  color = 'neutral'
}) {
  const map = {
    neutral: {
      bg: 'var(--surface-sunken)',
      fg: 'var(--text-secondary)',
      border: 'var(--border-default)'
    },
    teal: {
      bg: 'transparent',
      fg: 'var(--pw-channel-teal)',
      border: 'var(--pw-channel-teal)'
    },
    gold: {
      bg: 'transparent',
      fg: 'var(--pw-navy-ink)',
      border: 'var(--pw-eu-gold)'
    }
  };
  const c = map[color] || map.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      padding: '4px 10px',
      borderRadius: 'var(--radius-xs)',
      background: c.bg,
      color: c.fg,
      border: `1px solid ${c.border}`
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast/Toast.jsx
try { (() => {
function Toast({
  tone = 'info',
  children,
  onClose
}) {
  const border = tone === 'success' ? 'var(--pw-eu-gold)' : tone === 'error' ? 'var(--pw-pilot-red)' : 'var(--pw-channel-teal)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      background: 'var(--pw-navy-ink)',
      color: 'var(--pw-ice)',
      padding: '14px 18px',
      boxShadow: 'var(--shadow-md)',
      borderLeft: `3px solid ${border}`,
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      minWidth: 280
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, children), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--pw-muted-cool)',
      cursor: 'pointer',
      fontSize: 16,
      lineHeight: 1
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip/Tooltip.jsx
try { (() => {
const {
  useState
} = React;
function Tooltip({
  label,
  children
}) {
  const [show, setShow] = useState(false);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-block'
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false)
  }, children, show && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: '125%',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--pw-navy-ink)',
      color: 'var(--pw-ice)',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      padding: '6px 10px',
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-sm)',
      zIndex: 10
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button/Button.jsx
try { (() => {
const SIZES = {
  sm: {
    padding: '6px 14px',
    fontSize: 13
  },
  md: {
    padding: '10px 20px',
    fontSize: 14
  },
  lg: {
    padding: '14px 28px',
    fontSize: 15
  }
};
function variantStyle(variant) {
  switch (variant) {
    case 'secondary':
      return {
        background: 'transparent',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-strong)'
      };
    case 'ghost':
      return {
        background: 'transparent',
        color: 'var(--text-link)',
        border: '1px solid transparent'
      };
    case 'danger':
      return {
        background: 'var(--pw-pilot-red)',
        color: '#fff',
        border: '1px solid var(--pw-pilot-red)'
      };
    case 'primary':
    default:
      return {
        background: 'var(--pw-navy-ink)',
        color: 'var(--pw-ice)',
        border: '1px solid var(--pw-navy-ink)'
      };
  }
}
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button'
}) {
  const sizeStyle = SIZES[size] || SIZES.md;
  const vStyle = variantStyle(variant);
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
      borderRadius: 'var(--radius-xs)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease',
      ...sizeStyle,
      ...vStyle
    },
    onMouseEnter: e => {
      if (disabled) return;
      if (variant === 'primary') e.currentTarget.style.background = 'var(--pw-channel-teal)';
      if (variant === 'secondary') e.currentTarget.style.background = 'var(--surface-sunken)';
      if (variant === 'ghost') e.currentTarget.style.color = 'var(--text-link-hover)';
      if (variant === 'danger') e.currentTarget.style.background = '#a02f25';
    },
    onMouseLeave: e => {
      if (disabled) return;
      if (variant === 'primary') e.currentTarget.style.background = 'var(--pw-navy-ink)';
      if (variant === 'secondary') e.currentTarget.style.background = 'transparent';
      if (variant === 'ghost') e.currentTarget.style.color = 'var(--text-link)';
      if (variant === 'danger') e.currentTarget.style.background = 'var(--pw-pilot-red)';
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  onChange,
  disabled = false
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-primary)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange({
      target: {
        checked: !checked
      }
    }),
    style: {
      width: 18,
      height: 18,
      flexShrink: 0,
      border: `1px solid ${checked ? 'var(--pw-navy-ink)' : 'var(--border-default)'}`,
      background: checked ? 'var(--pw-navy-ink)' : 'var(--surface-card)',
      borderRadius: 'var(--radius-xs)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "9",
    viewBox: "0 0 11 9",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 4.5L4 7.5L10 1",
    stroke: "var(--pw-ice)",
    strokeWidth: "1.6",
    strokeLinecap: "square"
  }))), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  disabled = false,
  mono = false
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-sans)',
      width: '100%',
      maxWidth: 320
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    type: type,
    placeholder: placeholder,
    value: value,
    disabled: disabled,
    onChange: onChange,
    style: {
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
      fontSize: 14,
      padding: '10px 12px',
      borderRadius: 'var(--radius-xs)',
      border: `1px solid ${error ? 'var(--pw-pilot-red)' : 'var(--border-default)'}`,
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      color: 'var(--text-primary)',
      outline: 'none'
    },
    onFocus: e => {
      e.target.style.borderColor = 'var(--focus-ring)';
    },
    onBlur: e => {
      e.target.style.borderColor = error ? 'var(--pw-pilot-red)' : 'var(--border-default)';
    }
  }), error && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--pw-pilot-red)'
    }
  }, error));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio/Radio.jsx
try { (() => {
function Radio({
  label,
  checked,
  onChange,
  name,
  disabled = false
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-primary)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange({
      target: {
        checked: true
      }
    }),
    style: {
      width: 18,
      height: 18,
      flexShrink: 0,
      borderRadius: '50%',
      border: `1px solid ${checked ? 'var(--pw-navy-ink)' : 'var(--border-default)'}`,
      background: 'var(--surface-card)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: 'var(--pw-navy-ink)'
    }
  })), label, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    checked: !!checked,
    readOnly: true,
    style: {
      display: 'none'
    }
  }));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select/Select.jsx
try { (() => {
function Select({
  label,
  value,
  onChange,
  options = [],
  disabled = false
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-sans)',
      width: '100%',
      maxWidth: 280
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("select", {
    value: value,
    disabled: disabled,
    onChange: onChange,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      padding: '10px 12px',
      borderRadius: 'var(--radius-xs)',
      border: '1px solid var(--border-default)',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      color: 'var(--text-primary)',
      outline: 'none'
    }
  }, options.map(opt => /*#__PURE__*/React.createElement("option", {
    key: opt.value,
    value: opt.value
  }, opt.label))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch/Switch.jsx
try { (() => {
function Switch({
  label,
  checked,
  onChange,
  disabled = false
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-primary)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange({
      target: {
        checked: !checked
      }
    }),
    style: {
      width: 36,
      height: 20,
      borderRadius: 10,
      flexShrink: 0,
      background: checked ? 'var(--pw-channel-teal)' : 'var(--border-default)',
      position: 'relative',
      transition: 'background 120ms ease'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? 18 : 2,
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: '#fff',
      transition: 'left 120ms ease'
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderBottom: '1px solid var(--border-default)',
      fontFamily: 'var(--font-mono)'
    }
  }, tabs.map(t => {
    const isActive = t.value === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.value,
      onClick: () => onChange && onChange(t.value),
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '10px 18px',
        fontSize: 12,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
        borderBottom: `2px solid ${isActive ? 'var(--pw-eu-gold)' : 'transparent'}`,
        marginBottom: '-1px'
      }
    }, t.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Dialog/Dialog.jsx
try { (() => {
function Dialog({
  open,
  title,
  children,
  onClose,
  footer
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(10,23,33,0.55)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: 'var(--surface-card)',
      width: 420,
      maxWidth: '90vw',
      boxShadow: 'var(--shadow-lg)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px',
      borderBottom: '1px solid var(--border-default)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--text-secondary)',
      fontSize: 18,
      cursor: 'pointer'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px',
      fontSize: 14,
      color: 'var(--text-primary)',
      lineHeight: 1.6
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 24px',
      borderTop: '1px solid var(--border-default)',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Dialog/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card/Card.jsx
try { (() => {
function Card({
  children,
  padding = 24,
  elevated = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: elevated ? 'none' : '1px solid var(--border-default)',
      boxShadow: elevated ? 'var(--shadow-md)' : 'none',
      padding,
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)'
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card/Card.jsx", error: String((e && e.message) || e) }); }

// ui_kits/loods-product/ReportViewer.jsx
try { (() => {
function ReportViewer() {
  const [tab, setTab] = React.useState('findings');
  const rows = [{
    service: 'Exchange Online',
    target: 'Open-Xchange',
    status: /*#__PURE__*/React.createElement(window.Polderworks.StatusBadge, {
      status: "blocker"
    })
  }, {
    service: 'SharePoint',
    target: 'Nextcloud',
    status: /*#__PURE__*/React.createElement(window.Polderworks.StatusBadge, {
      status: "advisory"
    })
  }, {
    service: 'Teams',
    target: 'Matrix',
    status: /*#__PURE__*/React.createElement(window.Polderworks.StatusBadge, {
      status: "clear"
    })
  }, {
    service: 'OneDrive',
    target: 'Nextcloud',
    status: /*#__PURE__*/React.createElement(window.Polderworks.StatusBadge, {
      status: "clear"
    })
  }, {
    service: 'Entra ID',
    target: 'openDesk',
    status: /*#__PURE__*/React.createElement(window.Polderworks.StatusBadge, {
      status: "advisory"
    })
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      maxWidth: 620,
      boxShadow: 'var(--shadow-md)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--pw-navy-ink)',
      padding: '18px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/loods-mark.svg",
    width: "22",
    height: "22"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 15,
      color: 'var(--pw-ice)'
    }
  }, "loods")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.08em',
      color: 'var(--pw-muted-cool)'
    }
  }, "CONFIDENTIAL")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      color: 'var(--text-primary)',
      marginBottom: 2
    }
  }, "Microsoft 365 tenant exposure report"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-secondary)',
      marginBottom: 16
    }
  }, "acme.onmicrosoft.com \xB7 11 July 2026"), /*#__PURE__*/React.createElement(window.Polderworks.Tabs, {
    tabs: [{
      value: 'summary',
      label: 'Summary'
    }, {
      value: 'findings',
      label: 'Findings'
    }, {
      value: 'export',
      label: 'Export'
    }],
    active: tab,
    onChange: setTab
  }), tab === 'findings' && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(window.Polderworks.Table, {
    columns: [{
      key: 'service',
      label: 'Service'
    }, {
      key: 'target',
      label: 'Target'
    }, {
      key: 'status',
      label: 'Status',
      align: 'right'
    }],
    rows: rows
  }), /*#__PURE__*/React.createElement(window.Polderworks.Callout, {
    tone: "blocker"
  }, "Shared mailboxes use Exchange-only retention labels with no open-standard equivalent. Export and re-map before cutover.")), tab === 'summary' && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      fontSize: 14,
      color: 'var(--text-secondary)',
      lineHeight: 1.6
    }
  }, "34 services inspected. 7 blockers, 21 advisories, 6 clear. Loods read your tenant configuration only \u2014 nothing was changed or migrated."), tab === 'export' && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(window.Polderworks.CodeBlock, {
    prompt: "$"
  }, "loods export --format pdf --out ./loods-report.pdf"))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/loods-product/ReportViewer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/loods-product/Terminal.jsx
try { (() => {
function Terminal() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--pw-deep-water)',
      fontFamily: 'var(--font-mono)',
      maxWidth: 620
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--pw-panel-dark)',
      padding: '10px 14px',
      display: 'flex',
      gap: 7,
      alignItems: 'center',
      borderBottom: '1px solid var(--pw-border-dark)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 11,
      height: 11,
      borderRadius: '50%',
      background: 'var(--pw-pilot-red)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 11,
      height: 11,
      borderRadius: '50%',
      background: 'var(--pw-eu-gold)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 11,
      height: 11,
      borderRadius: '50%',
      background: 'var(--pw-channel-teal)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--pw-teal-light)',
      marginLeft: 8
    }
  }, "loods")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 22,
      fontSize: 13,
      lineHeight: 1.9,
      color: 'var(--pw-muted-cool)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--pw-teal-light)'
    }
  }, "$"), " loods scan --tenant acme.onmicrosoft.com"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--pw-ice)'
    }
  }, "reading tenant (read-only) ......... ok"), /*#__PURE__*/React.createElement("div", null, "services inspected ................. 34"), /*#__PURE__*/React.createElement("div", null, "migration blockers ............ ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--pw-red-light)'
    }
  }, "7")), /*#__PURE__*/React.createElement("div", null, "advisories ..................... ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--pw-eu-gold)'
    }
  }, "21")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--pw-teal-light)'
    }
  }, "\u25B8"), " report written to ./loods-report.pdf")));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/loods-product/Terminal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/polderworks-site/Footer.jsx
try { (() => {
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      padding: '32px 56px',
      background: 'var(--surface-page)',
      borderTop: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/polderworks-mark-navy.svg",
    width: "18",
    height: "18"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, "Polderworks B.V.")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.08em',
      color: 'var(--text-secondary)'
    }
  }, "NETHERLANDS \xB7 GERMANY \xB7 AUSTRIA \xB7 SWITZERLAND \xB7 FRANCE"));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/polderworks-site/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/polderworks-site/Header.jsx
try { (() => {
function Header() {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '22px 56px',
      borderBottom: '1px solid var(--border-default)',
      background: 'var(--surface-card)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/polderworks-mark-navy.svg",
    width: "28",
    height: "28"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 19,
      fontWeight: 600,
      color: 'var(--text-primary)',
      letterSpacing: '-0.01em'
    }
  }, "Polderworks")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 32,
      fontSize: 14,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Products"), /*#__PURE__*/React.createElement("span", null, "Trust & compliance"), /*#__PURE__*/React.createElement("span", null, "Pricing"), /*#__PURE__*/React.createElement("span", null, "Docs")), /*#__PURE__*/React.createElement(window.Polderworks.Button, {
    variant: "primary",
    size: "sm"
  }, "Talk to us"));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/polderworks-site/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/polderworks-site/Hero.jsx
try { (() => {
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--pw-navy-ink)',
      color: 'var(--pw-ice)',
      padding: '96px 56px',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'var(--pw-eu-gold)',
      marginBottom: 28
    }
  }, "Enterprise & compliance layer"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 52,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.05,
      margin: '0 0 24px'
    }
  }, "Sovereign infrastructure, engineered."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      lineHeight: 1.6,
      color: 'var(--pw-muted-cool)',
      maxWidth: 560,
      margin: '0 0 36px'
    }
  }, "Polderworks builds the compliance and enterprise layer on top of the sovereign European office stack \u2014 Nextcloud, openDesk, Open-Xchange and Matrix. Built for organisations that answer to regulators, not vendors."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(window.Polderworks.Button, {
    variant: "primary"
  }, "Talk to us"), /*#__PURE__*/React.createElement(window.Polderworks.Button, {
    variant: "ghost"
  }, "Read the Loods report \u2192"))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/polderworks-site/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/polderworks-site/ProductsSection.jsx
try { (() => {
function ProductsSection() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 56px',
      background: 'var(--surface-page)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'var(--pw-channel-teal)',
      marginBottom: 16
    }
  }, "One house, growing"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 32,
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: 'var(--text-primary)',
      margin: '0 0 40px',
      maxWidth: 600
    }
  }, "Loods is the first project. Two more join the house this year."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--pw-deep-water)',
      padding: 32
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/loods-mark.svg",
    width: "40",
    height: "40",
    style: {
      marginBottom: 20
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 20,
      color: 'var(--pw-ice)',
      marginBottom: 10
    }
  }, "loods"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--pw-muted-cool)',
      lineHeight: 1.6,
      margin: '0 0 18px'
    }
  }, "Read-only Microsoft 365 migration and gap scanner. Free, open source, available now."), /*#__PURE__*/React.createElement(window.Polderworks.Tag, {
    color: "gold"
  }, "Available")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      padding: 32,
      opacity: 0.5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 600,
      color: 'var(--text-primary)',
      marginBottom: 10
    }
  }, "Plane"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      lineHeight: 1.6,
      margin: '0 0 18px'
    }
  }, "Reserved for a future project."), /*#__PURE__*/React.createElement(window.Polderworks.Tag, null, "Coming later")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      padding: 32,
      opacity: 0.5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 600,
      color: 'var(--text-primary)',
      marginBottom: 10
    }
  }, "Fabric"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      lineHeight: 1.6,
      margin: '0 0 18px'
    }
  }, "Reserved for a future project."), /*#__PURE__*/React.createElement(window.Polderworks.Tag, null, "Coming later"))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/polderworks-site/ProductsSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/polderworks-site/TrustSection.jsx
try { (() => {
function TrustSection() {
  const items = [{
    title: 'Auditable',
    body: 'Every scan, every report and every access is logged. Nothing runs that a compliance officer cannot trace.'
  }, {
    title: 'Sovereign',
    body: 'Built on the European office stack, hosted where you choose. No dependency on a foreign hyperscaler.'
  }, {
    title: 'No lock-in',
    body: 'Open source, open licensed typography, open standards throughout. Leave whenever you like — you own the data.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 56px',
      background: 'var(--pw-navy-ink)',
      color: 'var(--pw-ice)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 48
    }
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.title
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 3,
      width: 40,
      background: 'var(--pw-eu-gold)',
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 20,
      fontWeight: 600,
      margin: '0 0 10px'
    }
  }, it.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--pw-muted-cool)',
      margin: 0
    }
  }, it.body)))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/polderworks-site/TrustSection.jsx", error: String((e && e.message) || e) }); }

__ds_ns.CodeBlock = __ds_scope.CodeBlock;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Card = __ds_scope.Card;

})();
