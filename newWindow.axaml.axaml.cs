using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;

namespace Mvvm1.Views
{
    public partial class newWindow.axaml : Window
    {
        public newWindow.axaml()
        {
            InitializeComponent();
#if DEBUG
            this.AttachDevTools();
#endif
        }

        private void InitializeComponent()
        {
            AvaloniaXamlLoader.Load(this);
        }
    }
}